import axios from "axios";
import React, { useEffect, useState } from "react";
import "../Styles/AllBlogs.css";
import { Link } from "react-router-dom";

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"))?.user;

  // Fetch blogs 
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs/allblogs",{
          headers:{
            authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setBlogs(res.data.data || []);
        setFilteredBlogs(res.data.data || []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };
    fetchBlogs();
  }, []);

  // Update filtered blogs whenever blogs or selectedCategory changes
  useEffect(() => {
    if (!selectedCategory) setFilteredBlogs(blogs);
    else
      setFilteredBlogs(
        blogs.filter(
          (b) => b.category?.trim().toLowerCase() === selectedCategory
        )
      );
  }, [blogs, selectedCategory]);

  const categories = [
    ...new Set(
      blogs.map((b) => b.category?.trim().toLowerCase()).filter(Boolean)
    ),
  ];

  const handleFilter = (category) => {
    setSelectedCategory(category.toLowerCase());
  };

  const handleView = (blog) => {
    setSelectedBlog(blog);
    setViewModal(true);
  };

  // Like/unlike handler
 const handleLike = async (blogId) => {
  if (!userInfo) return alert("Please login to like posts");

  // Optimistic update
  const updateLikes = (blogList) =>
    blogList.map((b) => {
      if (b._id !== blogId) return b;
      const likesArray = Array.isArray(b.likes) ? b.likes : [];
      const liked = likesArray.includes(userInfo._id);
      return {
        ...b,
        likes: liked
          ? likesArray.filter((id) => id !== userInfo._id)
          : [...likesArray, userInfo._id],
      };
    });

  setBlogs((prev) => updateLikes(prev));
  setFilteredBlogs((prev) => updateLikes(prev));

  setSelectedBlog((prev) => {
    if (!prev || prev._id !== blogId) return prev;
    const likesArray = Array.isArray(prev.likes) ? prev.likes : [];
    const liked = likesArray.includes(userInfo._id);
    return {
      ...prev,
      likes: liked
        ? likesArray.filter((id) => id !== userInfo._id)
        : [...likesArray, userInfo._id],
    };
  });

  try {
    await axios.post(
      `http://localhost:5000/api/blogs/${blogId}/like`,
      {},
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );
  } catch (err) {
    console.error("Error liking blog:", err);
    alert("Failed to like/unlike post.");
  }
};

  return (
    <div
      style={{
        padding: "20px",
        backgroundImage:
          "url('https://png.pngtree.com/thumb_back/fh260/background/20210714/pngtree-blur-creative-blog-background-image_741789.jpg')",
        backgroundSize: "cover",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "blue",
          textShadow: "2px 2px 5px gray",
          marginBottom: "20px",
        }}
      >
        All Blogs
      </h2>

      {/* Filter Buttons */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <button
          onClick={() => handleFilter("")}
          className={`filter-btn ${selectedCategory === "" ? "active" : ""}`}
        >
          All
        </button>
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => handleFilter(cat)}
            className={`filter-btn ${
              selectedCategory === cat ? "active" : ""
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Blog Cards */}
      {filteredBlogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <div className="blogs-grid">
          {filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              className="blog-card"
              style={{
                boxShadow: "2px 4px 4px 5px lightgray",
                padding: "15px",
                borderRadius: "10px",
                background: "#fff",
                display: "flex",
                flexDirection: "column",
                backgroundImage:
                  "linear-gradient(to right, rgba(255, 195, 170, 0.999), rgba(232, 221, 182, 0.762), rgba(96, 146, 145, 0.485))",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <Link
                  to={`/profile/${blog.author?.email || blog.authorEmail}`}
                >
                  <img
                    src={
                      blog.author?.avtar ||
                      "https://tse2.mm.bing.net/th/id/OIP.JWLTmaKWIEfuKNmh3kzPdQHaHa?pid=Api&P=0&h=180"
                    }
                    alt={blog.author?.name}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      boxShadow: "0 2px 4px black",
                    }}
                  />
                </Link>
                <Link
                  to={`/profile/${blog.author?.email || blog.authorEmail}`}
                  style={{ textDecoration: "none" }}
                >
                  <h6 style={{ color: "black", fontWeight: "500" }}>
                    <strong style={{ color: "blue" }}>{blog.author?.name}</strong>
                  </h6>
                </Link>
              </div>

              {blog.image && (
                <img
                  src={`http://localhost:5000/${blog.image}`}
                  alt={blog.title}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginTop: "10px",
                    marginBottom: "10px",
                    boxShadow: "0 2px 4px black",
                  }}
                  onClick={() => handleView(blog)}
                />
              )}

              <h3 style={{ marginBottom: "10px" }}>{blog.title}</h3>
              <p style={{ flexGrow: 1, color: "green", fontWeight: "bold" }}>
                {blog.content.substring(0, 150)}...
              </p>
              <p style={{ color: "black", fontWeight: "bold" }}>
                <strong>Category:</strong>{" "}
                {blog.category?.charAt(0).toUpperCase() +
                  blog.category?.slice(1)}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  margin: "10px 0",
                }}
              >
                <span
                  style={{
                    cursor: "pointer",
                    fontSize: "20px",
                    color: blog.likes?.includes(userInfo?._id)
                      ? "red"
                      : "black",
                  }}
                  onClick={() => handleLike(blog._id)}
                >
                  {blog.likes?.includes(userInfo?._id) ? "❤️" : "🤍"}
                </span>
                <span style={{ color: "black", fontSize: "16px" }}>
                  {blog.likes?.length || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Modal */}
      {viewModal && selectedBlog && (
        <div className="modal-overlay" onClick={() => setViewModal(false)}>
          <div className="modal view" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setViewModal(false)}
            >
              ✖
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "0px",
                borderRadius: "10px",
              }}
            >
              <img
                src={
                  selectedBlog.author?.avtar ||
                  "https://tse2.mm.bing.net/th/id/OIP.JWLTmaKWIEfuKNmh3kzPdQHaHa?pid=Api&P=0&h=180"
                }
                alt={selectedBlog.author?.name}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  boxShadow: "0 2px 4px black",
                }}
              />
              <h6 style={{ color: "black", fontWeight: "500" }}>
                <strong style={{ color: "blue" }}>
                  {selectedBlog.author?.name}
                </strong>
              </h6>
            </div>

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
              <strong>Category:</strong>{" "}
              {selectedBlog.category?.charAt(0).toUpperCase() +
                selectedBlog.category?.slice(1)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBlogs;
