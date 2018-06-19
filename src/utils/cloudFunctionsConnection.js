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
 *  Retrieve connections parameters and connect to IBM cloud functions
 **/

var openwhisk = require('openwhisk');

var DEFAULT_CLOUDFUNCTION_API_HOST = process.env.DEFAULT_CLOUDFUNCTION_API_HOST;
var DEFAULT_CLOUDFUNCTION_NAMESPACE = process.env.DEFAULT_CLOUDFUNCTION_NAMESPAC;
var DEFAULT_CLOUDFUNCTION_API_KEY = process.env.DEFAULT_CLOUDFUNCTION_API_KEY;
var DEFAULT_CLOUDFUNCTION_SQLBUCKET = process.env.DEFAULT_CLOUDFUNCTION_SQLBUCKET; 
var DEFAULT_CLOUDFUNCTION_PARSERS = process.env.DEFAULT_CLOUDFUNCTION_PARSERS;

var sqlcloudFunction = exports.sqlcloudFunction = "sqlcloudfunction";
var sqlcloudFunctionBucket  = exports.sqlcloudFunctionBucket = DEFAULT_CLOUDFUNCTION_SQLBUCKET;
var parserscloudFunction = exports.parserscloudFunction = DEFAULT_CLOUDFUNCTION_PARSERS;


var options = {
		apihost :DEFAULT_CLOUDFUNCTION_API_HOST, 
		api_key: DEFAULT_CLOUDFUNCTION_API_KEY,
		namespace: DEFAULT_CLOUDFUNCTION_NAMESPACE
};

var configure_openwhisk = exports.configure_openwhisk = function ()
{
	console.log("Configure client for connection to cloud function");
	return openwhisk(options);
};