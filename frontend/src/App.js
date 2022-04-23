
import Context, { ContextProvider } from '../../frontend/src/context/Context';
import SignupPage from '../../frontend/src/Pages/SignupPage';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css';

import HomePage from './Pages/HomePage';
import Navbar from './components/Navbar';
import './App.css'
import LoginPage from './Pages/LoginPage';
import BlogPage from './Pages/BlogPage';
import CreateBlogPage from './Pages/CreateBlogPage';
import BlogPost from './Pages/BlogPost';
import SearchPage from './Pages/SearchPage';
import VerifyOtpPage from './Pages/VerifyOtpPage';
import { useContext, useEffect } from 'react';
function App() {
  
  
  return (
    <Router>
      <ContextProvider>

        <Navbar />
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/Signup" element={<SignupPage />} />
          <Route exact path="/Login" element={<LoginPage />} />
          <Route exact path="/Blog" element={<BlogPage />} />
          <Route exact path="/Addblog" element={<CreateBlogPage />} />
          <Route exact path="/BlogPost" element={<BlogPost />} />
          <Route exact path="/Search" element={<SearchPage />} />
          <Route exact path="/verifyotp" element={<VerifyOtpPage />} />
        </Routes>
      </ContextProvider>
    </Router>
  );
}

export default App;
