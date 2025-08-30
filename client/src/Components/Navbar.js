import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Navbar.css"; // import the CSS file
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
const storedUser = localStorage.getItem("userInfo");
const userInfo = storedUser ? JSON.parse(storedUser).user : null;

  const [open, setOpen] = useState(false);
  const[user,setUser]=useState({});
  const dropdownRef = useRef(null);

  const handleToggle = () => setOpen(!open);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpen(false);
    }
  };
   useEffect(() => {
    
    const fetchuser=async()=>{
    if (!userInfo?.email) return;       
    try{
        const res=await axios.get(`http://localhost:5000/api/user/${userInfo.email}`);
        setUser(res.data.data);
      }catch(err){
        console.error("Error fetching user:", err);
      }
    }
    
    fetchuser();
  }, [userInfo]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToProfile = () => {
    navigate(`/profile/${userInfo.email}`);
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
    setOpen(false);
  };


  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          BLOGHUB
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                HomePage
              </Link>
          
            </li>

            {userInfo ? (
              <>
                 <li className="nav-item">
                  <Link className="nav-link" to="/create-blog">
                    Create Blog
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/all-blogs">
                    All Blogs
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-blogs">
                    My Blogs
                  </Link>
                </li>
             

                <li className="nav-item profile-menu" ref={dropdownRef}>
                  <img
                    src={user.avtar?user.avtar:"https://tse2.mm.bing.net/th/id/OIP.JWLTmaKWIEfuKNmh3kzPdQHaHa?pid=Api&P=0&h=180" }
                    alt="Profile"
                    className="profile-icon"
                    onClick={handleToggle}
                  />
                  {open && (
                    <div className="dropdown">
                      <div className="dropdown-item" onClick={goToProfile}>
                        My Profile
                      </div>
                      <div className="dropdown-item" onClick={handleLogout} style={{ backgroundColor: "red ", color: "white" }}>
                        Logout
                      </div>
                    </div>
                  )}
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
