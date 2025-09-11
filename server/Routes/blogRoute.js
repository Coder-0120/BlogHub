const express=require("express");
const router=express.Router();
const BlogModel=require("../Models/BlogModel");
const multer = require("multer");
const Verifytoken = require("../middlewares/Verifytoken");
const jwt=require("jsonwebtoken");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder to store uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage }); 

router.post("/create",Verifytoken, upload.single("image"),async(req,res)=>{
    const {title,content,author,category,authorEmail}=req.body;
    const image=req.file?req.file.path:null;
    try{
        const newblog=await BlogModel.create({
            title,
            content,
            author,
            category,
            image,
            authorEmail
        })
        await newblog.save();
        return res.status(201).json({
            success:true,
            message:"Blog created successfully",
            data:newblog
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Failed to create blog",
            error:error.message
        })
    }
})

router.get("/myblogs/:email",Verifytoken,async(req,res)=>{
    const email=req.params.email;
    const isAuthor=await BlogModel.find({authorEmail:email});
    if(!isAuthor || isAuthor.length === 0){
        return res.status(404).json({
            success:false,
            message:"No blogs found for this author"
        })
    }
    return res.status(200).json({
        success:true,
        message:"Blogs fetched successfully",
        data:isAuthor
    })

})

router.get("/allblogs",Verifytoken,async(req,res)=>{
    try{
        const allblogs=await BlogModel.find().populate("author", "name avtar ");
        if(!allblogs || allblogs.length === 0){
            return res.status(404).json({
                success:false,
                message:"No blogs found"
            })
        }
        return res.status(201).json({
            success:true,
            message:"All blogs fetched successfully",
            data:allblogs
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Failed to fetch blogs",
            error:error.message
        })
    }
})

router.delete("/delete/:id",Verifytoken,async(req,res)=>{
    try{
        await BlogModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            success:true,
            message:"Blog deleted successfully"
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Failed to delete blog",
            error:error.message
        })
    }
})

router.put("/update/:id",async(req,res)=>{
    const{title,content,category}=req.body;
    try{
        const updatedBlog=await BlogModel.findByIdAndUpdate(req.params.id,{
            title,
            category,
            content
        });
        return res.status(201).json({
            success:true,
            message:"Blog updated successfully",
            data:updatedBlog
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Failed to update blog",
            error:error.message
        })
    }

})
router.post("/:id/like", async (req, res) => {
  const blogId = req.params.id;
  const { userId } = req.body;

  try {
    const blog = await BlogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    if (blog.likes.includes(userId)) {
      blog.likes = blog.likes.filter(id => id !== userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();
    return res.status(200).json({
      success: true,
      message: "Blog liked/unliked successfully",
      data: blog
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to like/unlike blog",
      error: error.message
    });
  }
});

module.exports=router;