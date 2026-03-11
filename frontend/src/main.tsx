import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../loginsignup/Login.tsx'
import Forgotpassword from '../loginsignup/Forgotpassword.tsx'
import JobSearchPage from './app/pages/JobSearchPage.tsx'
import Applications from '../userLoggedIn/Applications.tsx'
import Resume from '../userLoggedIn/Resume.tsx'
import Profile from '../userLoggedIn/Profile'
import SignupPage from './app/pages/SignupPage.tsx'
import Newpassword from '../loginsignup/Newpassword.tsx'
//import ProfileTab from 'userLoggedIn/tabs/ProfileTab.tsx'
//import PreferenceTab from 'userLoggedIn/tabs/PreferenceTab.tsx'
//import AccountTab from 'userLoggedIn/tabs/AccountTab.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/*" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgotpassword" element={<Forgotpassword />} />
      <Route path="/user" element={<JobSearchPage />} />
      <Route path="/applications" element={<Applications />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/newpassword" element={<Newpassword />} />
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
