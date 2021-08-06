const mongoose = require("mongoose");
const slugify = require("slugify");
const Schema = mongoose.Schema;


const QusetionSchema  = new Schema({
    title: {
        type: String,
        required : [true,"Please provide a title"],
        minlength : [10,"Please provide a title at least 10 charachters"],
        unique : true
    },
    content : {
        type : String,
        required : [true, "Please provide a content"],
        minlength : [20,"Please provide a content at least 20 charachters"]
    },
    slug: {
        type: String
        // bunu bu şekildede yazabilirsin slug: string,
    },
    createAt: {
        type: Date,
        default : Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User"
    },
    likeCount : {
        type: Number,
        default: 0
    },
    likes : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "User"
        }
    ],
    answerCount : {
        type: Number,
        default:0
    },
    answers: [
        {
            type : mongoose.Schema.ObjectId,
            ref : "Answer"  
        }
    ]
});
QusetionSchema.pre("save",function(next){

    if(!this.isModified("title")){
        next();
    }
    this.slug = this.makeSlug();
    next();
});
QusetionSchema.methods.makeSlug = function() {

    return slugify(this.title,{
        replacement: "-",
        remove: null,
        lower: true
    })
}

module.exports = mongoose.model("Question",QusetionSchema)
