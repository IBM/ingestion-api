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
var Download = require('../service/DownloadService');

module.exports.getData = function getData (req, res, next) {
	var operator = req.swagger.params['operator'].value;
	var resourceid = req.swagger.params['resourceid'].value;
	Download.doCheckObject(resourceid)
	.then(()=>Download.doGetObject(resourceid))
	.then(function (data) {	
		utils.writeAll(res, data.Body.toString());
	})
	.catch(function (err, data) {
		utils.writeJson(res, JSON.stringify(err.code), err.statusCode);	   
	});
};
