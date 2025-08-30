import './App.css';
import Navbar from './Components/Navbar';
import AllBlogs from './Pages/AllBlogs';
import CreateBlogPage from './Pages/CreateBlogPage';
import MyBlogsPage from './Pages/MyBlogsPage';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import Register from './Pages/Register';
import { BrowserRouter as Router, Routes, Route ,Navigate} from 'react-router-dom';
import Profile from './Pages/Profile';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("userInfo"); 
  return isLoggedIn ? children : <Navigate to="/login" />;
};
function App() {
  
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/all-blogs" element={<ProtectedRoute><AllBlogs /></ProtectedRoute>} />
        <Route path="/create-blog" element={<ProtectedRoute><CreateBlogPage /></ProtectedRoute>} />
        <Route path="/my-blogs" element={<ProtectedRoute><MyBlogsPage /></ProtectedRoute>} />
        <Route path="/profile/:authorEmail" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
