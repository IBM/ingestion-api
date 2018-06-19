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
var squel = require("squel");
var cloudFunctionsConnection = require('../utils/cloudFunctionsConnection.js');

/**
 * Search datalake and return list of resource IDs and attributes 
 * Searches and retrieves resource IDs and metadata from the data lake based on search
 * criteria using the SQL Query service
 * 
 * tenantid String The tenant identifier of the client application 
 * sourceid String Identifier of source originating the data 
 * subjectid String A subject ID associated to some data resources in the data lake 
 * maxResults Long The maximum number of entries to be returned. Default and limit is 1000. (optional) 
 * offset String Next offset for subsequent queries. Default is \"\" (optional) 
 * returns promise
 */

exports.doQueryObjects = function(tenantid,sourceid,subjectid,operator,contenttype,maxResults,index,jobid) {
	var objectList = {};
	if( maxResults === null || maxResults === "") { maxResults = 1000;}
	if( index === null ) { index = ""; }
	if( jobid === null ) { jobid = ""; }
	console.log('Query objects');
	console.log('maxResults:'+maxResults);
	console.log('index:'+index);
	console.log('jobid:'+jobid);
	var select = squel
	.select()
	.from(cloudFunctionsConnection.sqlcloudFunctionBucket);
	if( tenantid !== "" ) { select.where("tenantid= \""+ tenantid + "\""); }
	if( sourceid !== "" )  { select.where("sourceid= \""+ sourceid+"\""); }
	if( subjectid !== "" )  { select.where("subjectid= \""+ subjectid+"\""); }
	if( operator !== "" )  { select.where("operator= \""+ operator+"\" "); }
	if( contenttype !== "" )  { select.where("contenttype= \""+ contenttype+"\""); }
	console.log("sqlSelect: "+select.toString());

	var ow = cloudFunctionsConnection.configure_openwhisk();
	var name = cloudFunctionsConnection.sqlcloudFunction;
	var blocking = true, result = true;
	var params = {
			sql: select.toString(), 
			maxresults: maxResults, 
			index: index, 
			jobid: jobid
	};

	return ow.actions.invoke({name, blocking, result, params});
	// return promise
};

