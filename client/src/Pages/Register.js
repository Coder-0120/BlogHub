import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import "../Styles/login.css";

const Register = () => {
    const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/user/register', {
        name,
        email,
        password,
      });

      const user = response.data; 
      localStorage.setItem('userInfo', JSON.stringify(user));
      alert('Registration successful');
      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
   

    <div className="container mt-5">
      <h2 className="mb-4 text-center">Register</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleRegister} className="border p-3 shadow-sm" style={{backgroundImage: "linear-gradient(to right, #f0f4f8, #e0e7ee)"}}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 ">Register</button>
            <p className="mt-3 text-center">
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>

  );
};

export default Register;
