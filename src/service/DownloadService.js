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
 * Check data resource from data lake
 * Check data exists in the metadata bucket
 *
 * resourceid String The resourceid of the resource to be retrieved
 * return promise
 **/
exports.doCheckObject = function (resourceid) {
    console.log('Check object id:'+resourceid);
    var cos = cosConnection.configure();
	return cos.headObject({
        Bucket: cosConnection.DEFAULT_METADATABUCKET,
        Key: resourceid,
    }).promise();
};

/**
 * Download data resource from data lake
 * Retrieves a data resource, referenced by its resourceid
 *
 * resourceid String The resourceid of the resource to be retrieved
 * return promise
 **/
exports.doGetObject = function (resourceid) {
    console.log('Download object id:'+resourceid);
    var cos = cosConnection.configure();
	return cos.getObject({
        Bucket: cosConnection.DEFAULT_OBJECTBUCKET,
        Key: resourceid,
        ResponseContentType: 'application/octet-stream'
    }).promise();
};

