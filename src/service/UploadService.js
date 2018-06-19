/**
 * Copyright 2017 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jshint esversion: 6 */
'use strict';

var AWS = require('ibm-cos-sdk');
var util = require('util');
var cloudFunctionsConnection = require('../utils/cloudFunctionsConnection.js');
var cosConnection = require('../utils/cosConnection.js');

/**
 * Parse document before sending to data lake
 * Validate and extract metadata from document
 *
 * contenttype The content type of the data e.g. HL7v2 or JSON
 * body InputStream The data object to write to data-lake (optional)
 * returns promise
 **/
exports.doParseContent = function(contenttype,body){
	//validate document
	var ow = cloudFunctionsConnection.configure_openwhisk();
	console.log("Configured parsers cloud function: " +cloudFunctionsConnection.parserscloudFunction);
	var parsers = JSON.parse(cloudFunctionsConnection.parserscloudFunction);
	if ( parsers.hasOwnProperty(contenttype) === false )
	{
		var err = {};
		err.message = "Unkown content type " + contenttype + ", no parser available";
		err.statusCode = 404;
		return Promise.reject(err);
	}	
	else
	{		
		var name = parsers[contenttype];
		var blocking = true, result = true;
		var params = {};
		params[contenttype+"input"]=body.toString().replace(/\n/g,"\r");
		return ow.actions.invoke({name, blocking, result, params});
		// return promise
	}
	
};


/**
 * Generate a resource id
 * build the resource id using the sequence of tenantid-sourceid-subjectid-timecreated-uuid
 * 
 * tenantid String The tenant identifier of the client application
 * sourceid String Identifier of source originating the data
 * subjectid String A subject ID associated to some data resources in the data lake 
 * operator String The operator identifier in the uploaded data (optional)
 * body InputStream The data object to write to data-lake (optional)
 * returns String
 **/
//resourceid : tenant-source-subject-creationTime-uuid
exports.doGenerateResourceId = function(tenantid,sourceid,subjectid,operator,body) {
    //generate uuid
    const uuidv4 = require('uuid/v4');
    var uuid = uuidv4();
    //get current time    
    var dateFormat = require('dateformat');
    var now = new Date();
    var nowFormatted = dateFormat(now, "yyyymmddHHMMssl"); 
    //build resurceid 
    var resourceid = tenantid +'-'+ sourceid +'-'+ subjectid +'-'+ nowFormatted + '-' + uuid;
    console.log('resourceid:'+resourceid);
    return resourceid;
};


/**
 * Generate a Metata Map
 * Build metadata object linking request inout metadata and data from the hl7parser function 
 *
 * tenantid String The tenant identifier of the client application
 * sourceid String Identifier of source originating the data
 * subjectid String A subject ID associated to some data resources in the data lake 
 * operator String The operator identifier in the uploaded data (optional)
 * contenttype The content type of the data e.g. HL7v2 or JSON
 * validationdata Object map from hl7parser cloud function 
 * resourceid String The resourceid of the resource to be retrieved
 * body InputStream The data object to write to data-lake (optional)
 * returns Object map
 **/  
exports.doGenerateMetadata = function(tenantid,sourceid,subjectid,operator,contenttype,validationdata,resourceid,body) {	  
    var metadata = {};
    //save metadata in a map object
    metadata = {
    		"sourceId":sourceid,
    		"tenantId":tenantid,
    		"subjectId":subjectid,
    		"operator":operator,
    		"contenttype":contenttype,
    		"objectSize":body.length.toString(),
    		"resourceid":resourceid
    };
    metadata = Object.assign(metadata,validationdata["metadata"]);
    console.log("metadata"+JSON.stringify(metadata));   
    return metadata;
};


/**
 * Create data resource into data lake
 * Writes a data resource with the specified resource id  
 *
 * resourceid String The resourceid of the resource to be created
 * body InputStream The data object to write to data-lake 
 * returns ObjectMeta
 **/  
exports.doCreateObject = function(resourceid,body) {
    	var cos = cosConnection.configure();
    	console.log("Create object");
    	console.log("resourceid"+resourceid);
    return cos.putObject({
        Bucket: cosConnection.DEFAULT_OBJECTBUCKET,
        Key: resourceid,
        Body: body
    }).promise();
};


/**
 * Create metadata resource into data lake
 * Writes a metadata resource with the specified resource id  
 *
 * resourceid String The resourceid of the resource to be created
 * body String The metadata object to write in data-lake 
 * returns promise
 **/  
exports.doCreateMetadata = function(resourceid,metadata) {
	var cos = cosConnection.configure();
	console.log("metadata"+JSON.stringify(metadata));
	console.log("resourceid"+resourceid);
	return cos.putObject({
	    Bucket: cosConnection.DEFAULT_METADATABUCKET,
	    Key: resourceid,
	    Body: JSON.stringify(metadata)
	}).promise();
};
