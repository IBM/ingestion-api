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
var SearchByKey = require('../service/SearchByKeyService');
var Metadata = require('../service/MetadataService');



module.exports.searchByKey = function searchByKey (req, res, next) {
	var tenantid = req.swagger.params['tenantid'].value;
	var sourceid = req.swagger.params['sourceid'].value;
	var subjectid = req.swagger.params['subjectid'].value;
	var operator = req.swagger.params['operator'].value;
	var maxResults = req.swagger.params['maxResults'].value;
	var offset = req.swagger.params['offset'].value;

	SearchByKey.doListObjects(tenantid,sourceid,subjectid,operator,maxResults,offset)
	.then( function (data) {
		var objectList = {};
		console.log("Get metadata done with success");
		objectList["nextOffset"]=data["NextMarker"];
		var resourceids =[];
		for (var i=0; i<data["Contents"].length; i++)
		{
			resourceids[i]=data["Contents"][i]["Key"];
		} 
		objectList["resultsList"] = [];
		var getMetadataPromises = resourceids.map((resourceid)=>Metadata.doGetMetadata(resourceid));
		Promise.all(getMetadataPromises)
		.then(function (data) {
			for (var i=0; i<data.length; i++)
			{
				objectList["resultsList"].push(JSON.parse(data[i].Body.toString()));
			}
			utils.writeJson(res, JSON.stringify(objectList));	
		})
		.catch(function (err, data) {
			utils.writeJson(res, JSON.stringify(err.message), err.statusCode);	});	   		
	})
	.catch(function (err, data) {
		utils.writeJson(res, JSON.stringify(err.message), err.statusCode);	   
	});
};
