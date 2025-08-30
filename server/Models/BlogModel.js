const mongoose=require("mongoose");
const BlogSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: "User", 
         required: true 
    },
    authorEmail:{
        type:String,
        required:true
    },
    image:{
        type:String,
    },
    likes:{
        type:[String], // array of user emails who liked the blog
        default: []
    }
})

module.exports=mongoose.model("AllBlog",BlogSchema);