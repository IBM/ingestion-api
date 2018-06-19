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
var cosConnection = require('../utils/cosConnection.js');

/**
 * Search datalake and return list of resource IDs
 * Searches and retrieves resource IDs from the metadata bucket based on search criteria on key
 *
 * tenantid String The tenant identifier of the client application
 * sourceid String Identifier of source originating the data
 * subjectid String A subject ID associated to some data resources in the data lake
 * maxResults Long The maximum number of entries to be returned. Default and limit is 1000. (optional)
 * offset String Next offset for subsequent queries. Default is \"\" (optional)
 * returns array of promise
 **/

exports.doListObjects = function(tenantid,sourceid,subjectid,operator,maxResults,offset) {
		var objectList = {};
		if( maxResults === null ) { maxResults = 1000; }
		if( offset === null ) { offset = ""; }
		var prefix = tenantid +'-'+ sourceid +'-'+ subjectid +'-';
		console.log('List objects');
		console.log('query:'+prefix);
		console.log('maxResults:'+maxResults);
		console.log('offset:'+offset);
		var cos = cosConnection.configure();
		return cos.listObjects({
			Bucket: cosConnection.DEFAULT_METADATABUCKET, /* required */
			Marker: offset,
			MaxKeys: maxResults,
			Prefix: prefix
		}).promise();           // successful response
};

