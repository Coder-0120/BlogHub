const mongoose=require("mongoose");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    avtar:{
        type:String,
        default:"https://tse2.mm.bing.net/th/id/OIP.JWLTmaKWIEfuKNmh3kzPdQHaHa?pid=Api&P=0&h=180"
    }
})

module.exports=mongoose.model("User",userSchema);