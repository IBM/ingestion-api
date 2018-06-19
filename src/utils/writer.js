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
 *  Write response 
 *  
 **/

var ResponsePayload = function(code, payload) {
  this.code = code;
  this.payload = payload;
}

exports.respondWithCode = function(code, payload) {
  return new ResponsePayload(code, payload);
}

var writeJson = exports.writeJson = function(response, arg1, arg2) {
  var code;
  var payload;

  if(arg1 && arg1 instanceof ResponsePayload) {
    writeJson(response, arg1.payload, arg1.code);
    return;
  }
  if(arg2 && Number.isInteger(arg2)) {
    code = arg2;
  }
  else {
	  
	  if(arg1 && Number.isInteger(arg1)) {
      code = arg1;
    }
  }
  if(code && arg1) {
    payload = arg1;
  }
  else if(arg1) {
    payload = arg1;
  }
  
  if(!code) {
    // if no response code given, we default to 200
    code = 200;
  }
  if(typeof payload === 'object') {
    payload = JSON.stringify(payload, null, 2);
  }
  if(code!= 200)
  {
	  console.log("err_code: "+code);
	  console.log("err_message: "+payload)
  }
  response.writeHead(code, {'Content-Type': 'application/json'});
  response.end(payload);
  
}


var writeAll = exports.writeAll = function(response, arg1, arg2) {
	var code;
	var payload;

	if(arg1 && arg1 instanceof ResponsePayload) {
		writeAll(response, arg1.payload, arg1.code);
		return;
	}
	if(arg2 && Number.isInteger(arg2)) {
		code = arg2;
	}
	else {

		if(arg1 && Number.isInteger(arg1)) {
			code = arg1;
		}
	}
	if(code && arg1) {
		payload = arg1;
	}
	else if(arg1) {
		payload = arg1;
	}

	if(!code) {
		// if no response code given, we default to 200
		code = 200;
	}
	response.writeHead(code);
	response.end(payload);
}
