import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../loginsignup/Login.tsx'
import Signup from '../loginsignup/Signup.tsx'
import Forgotpassword from '../loginsignup/Forgotpassword.tsx'
import User from '../userLoggedIn/User.tsx'
import Applications from '../userLoggedIn/Applications.tsx'
import Resume from '../userLoggedIn/Resume.tsx'
import Profile from '../userLoggedIn/Profile'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/*" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgotpassword" element={<Forgotpassword />} />
      <Route path="/user" element={<User />} />
      <Route path="/applications" element={<Applications />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
