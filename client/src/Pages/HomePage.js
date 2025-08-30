import React from "react";
import { Link } from "react-router-dom";
import "../Styles/HomePage.css";
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init();

function HomePage() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  return (
    <div className="homepage" style={{backgroundImage:"none"}}>
      <section className="hero-section">
        <video autoPlay muted loop className="video-bg">
          <source
            src="/videos/1093662-hd_1920_1080_30fps.mp4" 
            type="video/mp4"
          />
          Your browser does not support HTML5 video.
        </video>
        <div className="overlay"></div>

        <div className="hero-content">
          <h1 className="title">
            Welcome to <span>BlogHub</span>
          </h1>
          <p className="subtitle">Share your thoughts with the world 🌍</p>
          <div className="buttons">
            <Link to={userInfo ? "/create-blog" : "/register"} className="btn primary">
              {userInfo ? `Hello, ${userInfo.user.name}` : "Get Started"}
            </Link>
            <Link to={userInfo ? "/all-blogs" : "/login"} className="btn secondary">
              {userInfo ? "Go to Blogs" : "Login"}
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section" >
        <h2 className="main-heading" data-aos="fade-up">
          ✨ Our Features
        </h2>
        <div className="features">
          <div className="feature-card" data-aos="fade-right">
            <h2>✍️ Write Blogs</h2>
            <p>Create blogs easily with our simple editor.</p>
          </div>
          <div className="feature-card" data-aos="fade-up">
            <h2>🌐 Share Globally</h2>
            <p>Your blogs are visible to all registered users.</p>
          </div>
          <div className="feature-card" data-aos="fade-left">
            <h2>📖 Read & Learn</h2>
            <p>Explore amazing blogs written by others.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
