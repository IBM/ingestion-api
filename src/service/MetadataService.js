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
 * Get metadata of an uploaded data resource
 * Retrieves json file containing metadata from the metadata bucket for a resource ID
 *
 * resourceid String The resourceid of the data resource for which metadata should returned
 * returns promise
 **/
exports.doGetMetadata = function(resourceid) {
	 console.log('Getting metadata'); 
	 var cos = cosConnection.configure();
	 return cos.getObject({
	    Bucket: cosConnection.DEFAULT_METADATABUCKET,
	    Key: resourceid,
	 }).promise();
};
