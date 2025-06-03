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

const userSchema = new mongoose.Schema({

    LessonCode:{
        type: String,
        required: true,
    },
    LessonDes:{
        type:String,
        required:true
    },
    CourseCode:{
        type:String,
        required:true
    },
    ChapterCode:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    }
}, {versionKey: false})

const Lesson = mongoose.model("lesson",userSchema, "Lesson");
module.exports=Lesson;