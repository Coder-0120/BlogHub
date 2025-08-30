const express=require("express");
const connectDb = require("./Config/db");
const path = require("path");
const dotenv = require("dotenv");
const cors=require("cors");
dotenv.config();
const app=express();
app.use(express.json());
app.use(cors());
connectDb();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/",(req,res)=>{
    res.send("Welcome to the Blog API");
})
app.use("/api/user",require("./Routes/userRoute"));
app.use("/api/blogs",require("./Routes/blogRoute"));

app.listen(5000,()=>{
    console.log("Server is running on port 5000");
});
