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

/**
 *  Retrieve connections parameters and connect to IBM COS instance
 **/

var AWS = require('ibm-cos-sdk');
var util = require('util');


var DEFAULT_IAM_ENDPOINT = process.env.DEFAULT_IAM_ENDPOINT;
var DEFAULT_ENDPOINT_URL = process.env.DEFAULT_ENDPOINT_URL;
var DEFAULT_SERVICE_API_KEY = process.env.DEFAULT_SERVICE_API_KEY;
var DEFAULT_SERVICE_INSTANCE_ID = process.env.DEFAULT_SERVICE_INSTANCE_ID;
var DEFAULT_OBJECTBUCKET = exports.DEFAULT_OBJECTBUCKET = process.env.DEFAULT_OBJECTBUCKET;
var DEFAULT_METADATABUCKET = exports.DEFAULT_METADATABUCKET = process.env.DEFAULT_METADATABUCKET;


var config = {
		endpoint: DEFAULT_ENDPOINT_URL,
		apiKeyId: DEFAULT_SERVICE_API_KEY,
		ibmAuthEndpoint: DEFAULT_IAM_ENDPOINT,
		serviceInstanceId: DEFAULT_SERVICE_INSTANCE_ID,
};

var configure = exports.configure = function ()
{
	console.log("Configure client for connection: "+JSON.stringify(config));
	return new AWS.S3(config);
};

