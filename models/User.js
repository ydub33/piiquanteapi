const mongoose=require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
const MongooseErrors = require('mongoose-errors')

const { Schema } = mongoose;

const UserSchema= new Schema ( { 
    email : {
        type : String,
        required : true,
        unique: true 
    },
    password : {
        type : String,
        required : true
    },
} )

UserSchema.plugin(MongooseErrors);
UserSchema.plugin(uniqueValidator);

module.exports=User=mongoose.model('users',UserSchema)