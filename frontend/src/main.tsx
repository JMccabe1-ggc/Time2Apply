import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login.tsx'
import Forgotpassword from './pages/Forgotpassword.tsx'
import JobSearchPage from './pages/JobSearchPage.tsx'
import Applications from './pages/Applications.tsx'
import Resume from './pages/Resume.tsx'
import Profile from './pages/Profile.tsx'
import SignupPage from './pages/SignupPage.tsx'
import Newpassword from './pages/Newpassword.tsx'
import Location from './pages/Location.tsx'
import ChangePassword from './pages/ChangePassword.tsx'
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
      <Route path="/location" element={<Location />} />
      <Route path="/changepassword" element={<ChangePassword />} />

    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
