import axios from "axios";
import React, { useEffect, useState } from "react";
import "../Styles/MyBlogsPage.css";

const MyBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const storedData = JSON.parse(localStorage.getItem("userInfo"));
  const userInfo = storedData?.user;

  // Fetch blogs
  useEffect(() => {
    if (!userInfo) return;

    const fetchBlogs = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/blogs/myblogs/${userInfo.email}`
        );
        setBlogs(res.data.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };

    fetchBlogs();
  }, [userInfo]);

  // Delete blog
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/blogs/delete/${id}`);
      setBlogs(blogs.filter((blog) => blog._id !== id));
      alert("Blog deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete blog.");
    }
  };

  // Edit blog
  const handleEdit = (blog) => {
    setSelectedBlog({
      _id: blog._id,
      title: blog.title,
      content: blog.content,
      category: blog.category,
    });
    setShowModal(true);
  };

  // Save blog
  const handleSave = async () => {
    try {
      const { _id, title, content, category } = selectedBlog;
      await axios.put(`http://localhost:5000/api/blogs/update/${_id}`, {
        title,
        content,
        category,
      });

      setBlogs(
        blogs.map((blog) =>
          blog._id === _id ? { ...blog, title, content, category } : blog
        )
      );

      setShowModal(false);
      alert("Blog updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update blog.");
    }
  };
  const handleView = (blog) => {
    setSelectedBlog(blog);
    setViewModal(true);
  };

  return (
    <div style={{ padding: "20px" ,backgroundImage: "url('https://png.pngtree.com/thumb_back/fh260/background/20210714/pngtree-blur-creative-blog-background-image_741789.jpg')", backgroundSize: "cover" , minHeight: "100vh"}}>
      <h2
        style={{
          textAlign: "center",
          color: "blue",
          textShadow: "2px 2px 5px gray",
          marginBottom: "20px",
        }}
      >
        My Blogs
      </h2>

      {blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <div className="blogs-grid">
          
          {blogs.map((blog) => (
            <div
              key={blog._id}
              // className="blog-card"
              style={{
                boxShadow: "2px 4px 4px 5px lightgray",
                padding: "15px",
                borderRadius: "10px",
                // background: "#fff",
                display: "flex",
                flexDirection: "column"
              }}
              className="blog-card"
            >
              {blog.image && (
                <img
                  src={`http://localhost:5000/${blog.image}`}
                  alt={blog.title}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    boxShadow: "0 2px 4px black",
                  }}
                  onClick={() => handleView(blog)}
                />
              )}
              <h3 style={{ marginBottom: "10px" }}>{blog.title}</h3>
              <p style={{ flexGrow: 1 }}>{blog.content.substring(0, 150)}...</p>
              <p>
                <strong>Category:</strong> {blog.category}
              </p>
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => handleEdit(blog)}
                  className="btn-edit"
                 
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && selectedBlog && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ✖
            </button>
            <h2>Edit Blog</h2>

            <label>Title:</label>
            <input
              type="text"
              value={selectedBlog.title}
              onChange={(e) =>
                setSelectedBlog({ ...selectedBlog, title: e.target.value })
              }
            />

            <label>Content:</label>
            <textarea
              rows="10"
              value={selectedBlog.content}
              onChange={(e) =>
                setSelectedBlog({ ...selectedBlog, content: e.target.value })
              }
            />

            <label>Category:</label>
           <select
            name="category"
            value={selectedBlog.category}
            onChange={(e) =>
              setSelectedBlog({ ...selectedBlog, category: e.target.value })
            }
            required
          >
            <option value="">Select a category</option>
            <option value="technology">Technology</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="education">Education</option>
            <option value="travel">Travel</option>
            <option value="health">Health</option>
          </select>

            <div className="modal-actions">
              <button  onClick={() => setShowModal(false)}>Cancel</button>
              <button  onClick={handleSave}>Save</button>
            </div>

          </div>
        </div>
      )}

            {viewModal && selectedBlog && (
        <div className="modal-overlay " onClick={() => setViewModal(false)}>
          <div
            className="modal view"
            onClick={(e) => e.stopPropagation()} 
          >
            <button className="modal-close" onClick={() => setViewModal(false)}>
              ✖
            </button>
            {selectedBlog.image && (
              <img
                src={`http://localhost:5000/${selectedBlog.image}`}
                alt={selectedBlog.title}
                className="modal-image"
              />
            )}
            <h2>{selectedBlog.title}</h2>
            <p>{selectedBlog.content}</p>
            <p>
              <strong>Category:</strong> {selectedBlog.category}
            </p>
          </div>
        </div>
      )}


    </div>
  );
};

export default MyBlogsPage;
