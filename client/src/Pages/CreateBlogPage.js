import React, { useState } from "react";
import '../Styles/CreateBlog.css';
import axios from "axios";

const CreateBlogPage = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"))?.user;

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    image: null,
  });


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("category", formData.category);
    data.append("author", userInfo._id);
    data.append("authorEmail", userInfo.email);
    if (formData.image) data.append("image", formData.image);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/blogs/create",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Response:", res.data);
      alert("Blog published successfully!");
      setFormData({ title: "", content: "", category: "", image: null });
    } catch (error) {
      console.error("Error in publishing blog:", error);
      alert("Failed to publish blog. Check console for details.");
    }
  };

  return (
    <div className="create-blog-container">
      <h2 className="create-blog-title">✍️ Create a New Blog</h2>
      <form className="create-blog-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Blog Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter blog title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Blog Content</label>
          <textarea
            name="content"
            placeholder="Write your blog here..."
            rows="6"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            <option value="technology">Technology</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="education">Education</option>
            <option value="travel">Travel</option>
            <option value="health">Health</option>
          </select>
        </div>

        <div className="form-group">
          <label>Upload Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submit-btn">Publish Blog 🚀</button>
      </form>
    </div>
  );
};

export default CreateBlogPage;
