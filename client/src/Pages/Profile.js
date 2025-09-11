import React, { useEffect, useState } from "react";
import "../Styles/Profile.css";
import axios from "axios";
import { useParams } from "react-router-dom";   

const Profile = () => {
  const { authorEmail } = useParams(); 
  const storedUser = localStorage.getItem("userInfo");
  const userInfo = storedUser ? JSON.parse(storedUser).user : null;

  const [blogs, setBlogs] = useState([]);
  // const[user,setUser]=useState({});
  const [user, setUser] = useState({
    name: "",
    avtar: "",
    email: "",
  });
  const [editUser, setEditUser] = useState({ name: "", avtar: "" });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const emailToFetch = authorEmail || userInfo?.email;
    if (!emailToFetch) return;

    const fetchBlogs = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/blogs/myblogs/${emailToFetch}`,{
            headers:{
            authorization: `Bearer ${localStorage.getItem("token")}`
          }
          }
        );
        setBlogs(res.data.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };

    const fetchuser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/user/${emailToFetch}`
        );
        const data = res.data.data;
        setUser({
          name: data.name || "",
          avtar:
            data.avtar ||
            "https://tse2.mm.bing.net/th/id/OIP.JWLTmaKWIEfuKNmh3kzPdQHaHa?pid=Api&P=0&h=180",
          email: data.email || emailToFetch,
        });
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchBlogs();
    fetchuser();
  }, [authorEmail]);

  const handleProfile = () => {
    // copy current user into editUser
    setEditUser({ name: user.name, avtar: user.avtar });
    setOpen(true);
  };

  const handleSave = async () => {
    setUser(editUser);

    localStorage.setItem("userInfo", JSON.stringify({ user: editUser }));
    setOpen(false);
    try {
      const res = await axios.put(
        `http://localhost:5000/api/user/${user.email}`,
        {
          name: editUser.name,
          avtar: editUser.avtar,
        }
      );
      setUser(res.data.data);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({ user: res.data.data })
      );
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update profile. Try again.");
    }
  };

  // const deletePic=async(email)=>{
  //   try{
  //     const userpic=await axios.put(`http://localhost:5000/api/user/pic/delete/${email}`);
  //     setUser(userpic);
  //   }
  //   catch(err){
  //     console.error(err);
  //     alert("Failed to delete pic.");

  //   }
  // }
  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <img
            src={user.avtar}
            alt="User Avatar"
            style={{ width: "150px", height: "150px", borderRadius: "50%" }}
          />
        </div>

        <div className="profile-info">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
{/*  viewing our  profile */}
          {(!authorEmail || authorEmail === userInfo?.email) && (
            <button className="edit-btn" onClick={handleProfile}>
              Edit Profile
            </button>
          )}
          {/* <h1 style={{color:"red"}}>{user.avtar}</h1> */}
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-item">No. of Blogs Published: {blogs.length}</div>
        <br />
        {/* <div className="stat-item">No. of Likes Received: </div> */}
      </div>

      {open && (
        <div className="modal-overlay">
          <div className="modal-profile">
            <button className="modal-close" onClick={() => setOpen(false)}>
              ✖
            </button>
            <h2>Edit Profile</h2>

            <img
              src={
                editUser.avtar ||
                "https://tse2.mm.bing.net/th/id/OIP.JWLTmaKWIEfuKNmh3kzPdQHaHa?pid=Api&P=0&h=180"
              }
              style={{ width: "150px", height: "150px", borderRadius: "50%" }}
            />
            <label>User Name:</label>
            <input
              type="text"
              value={editUser.name}
              onChange={(e) =>
                setEditUser({ ...editUser, name: e.target.value })
              }
            />
            <label>Profile Pic</label>
            <input
              type="text"
              value={editUser.avtar}
              onChange={(e) =>
                setEditUser({ ...editUser, avtar: e.target.value })
              }
            />

            <div className="modal-actions">
              <button onClick={() => setOpen(false)}>Cancel</button>
              <button onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
