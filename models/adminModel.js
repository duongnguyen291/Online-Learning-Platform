/*

Copyright 2024 Himanshu Dinkar

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  directorName: {
    type: String,
    required: true,
  },
  collegeName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  centerCode:{
    type:Number,
    required:true
  },
  
  password: {
    type: String,
    required: true,
  },
  role:{
    type:String,
    enum:['Registrar','Director','Teacher'],
    default:'Director'
  }
}, {versionKey: false});

const Admin = mongoose.model("admin", adminSchema, 'Admin');

module.exports = Admin;
