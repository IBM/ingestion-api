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

var util = require('util');
var utils = require('../utils/writer.js');
var SearchByMetadata = require('../service/SearchByMetadataService');



module.exports.searchByMetadata = function searchByMetadata (req, res, next) {
	var tenantid = req.swagger.params['tenantid'].value;
	var sourceid = req.swagger.params['sourceid'].value;
	var subjectid = req.swagger.params['subjectid'].value;
	var operator = req.swagger.params['operator'].value;
	var contenttype = req.swagger.params['contenttype'].value;
	var maxResults = req.swagger.params['maxResults'].value;
	var offset = req.swagger.params['offset'].value;
	var index = "";
	var jobid ="";
	
	if ( offset !== null && offset !== "" )
	{
		var arr = offset.split("#");
		if ( arr.length !== 2 )
		{
			utils.writeJson(res, JSON.stringify("Bad input format"), 404);	  
			return;
		}
		index = Number(arr[0]);
		jobid =	arr[1];
	}
	

	SearchByMetadata.doQueryObjects(tenantid,sourceid,subjectid,operator,contenttype,maxResults,index,jobid)
	.then( function (data) {
		var objectList = {};
		console.log("Get metadata done with success");
		objectList["resultsList"] = [];
		var jsonObject = JSON.parse(data["result_set_sample"]);
		if(jsonObject.data.length > 0)
		{
			if( data["result_next_index"] != "" )
			{
				objectList["nextOffset"] = data["result_next_index"];
				objectList["jobid"] = data["jobId"];
			}
			objectList["resultsList"] = jsonObject.data;
		}
		
		utils.writeJson(res, JSON.stringify(objectList));	
	})
	.catch(function (err, data) {
    	utils.writeJson(res, JSON.stringify(err.message), err.statusCode);	   
    });
};
