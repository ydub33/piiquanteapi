const mongoose=require('mongoose')

const MongooseErrors = require('mongoose-errors')

const { Schema } = mongoose;

const SauceSchema= new Schema ( { 

    userId : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    manufacturer : {
        type : String
    },
    description : {
        type : String
    },
    mainPepper : {
        type : String
    },
    imageUrl : {
        type : String
    },
    heat : {
        type : Number
    },
    likes : {
        type : Number,
        default:0
    },
    dislikes : {
        type : Number,
        default:0
    },
    usersLiked : {
        type : [String]
    },
    usersDisliked : {
        type : [String]
    },

} )

SauceSchema.plugin(MongooseErrors);

module.exports=Sauce=mongoose.model('sauce',SauceSchema)