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

var utils = require('../utils/writer.js');
var Upload = require('../service/UploadService');
var express = require('express');
var bodyParser = require('body-parser');


module.exports.postData = function postData (req, res, next) {
	var tenantid = req.swagger.params['tenantid'].value;
	var sourceid = req.swagger.params['sourceid'].value;
	var subjectid = req.swagger.params['subjectid'].value;
	var operator = req.swagger.params['operator'].value;
	var contenttype = req.swagger.params['contenttype'].value;
	var body = req.swagger.params['body'].value;
	
	//check if content is valid
	Upload.doParseContent(contenttype,body)
	.then(function(validationdata){
		if( validationdata["valid"] === "true")
		{
			var resourceid = Upload.doGenerateResourceId(tenantid,sourceid,subjectid,operator,body); 
			var metadata = Upload.doGenerateMetadata(tenantid,sourceid,subjectid,operator,contenttype,validationdata,resourceid,body);				
			//Generate resource id and metadata map then pass to the create objects as arguments with he body.
			Upload.doCreateMetadata(resourceid,metadata)
			.then(()=>Upload.doCreateObject(resourceid,body))
			.then(function() {
				utils.writeJson(res, metadata);
			})
			.catch(function (err, data) {
				utils.writeJson(res, JSON.stringify(err.message), err.statusCode);	   
			});
		}
	})
	.catch(function (err) {
		console.log("err" + JSON.stringify(err));
		utils.writeJson(res, JSON.stringify(err.message), err.statusCode);	
	});

};