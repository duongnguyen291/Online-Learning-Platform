// Copyright 2024 Himanshu
// Project is undercopyright restrictions please read the LICENSE.txt file
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

const mongoose = require('mongoose');
const {version} = require("mongoose");

const userSchema = new mongoose.Schema({

    UserCode:{
        type: String,
        required: true,
    },
    Name:{
        type:String,
        required:true
    },
    Role:{
        type:String,
        required:true
    },
    DOB:{
        type:Date,
        required:true
    },
    Login:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    }
}, {versionKey: false})

const User = mongoose.model("User",userSchema,'User');
module.exports=User;