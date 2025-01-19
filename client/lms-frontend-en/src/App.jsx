import './App.css'

import { Route, Routes } from 'react-router-dom'

import RequireAuth from './components/Auth/RequireAuth'
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'
import CourseDescription from './pages/course/CourseDescription'
import CourseList from './pages/course/CourseList'
import CreateCourse from './pages/course/CreateCourse'
import Denied from './pages/Denied'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Signin from './pages/Signin'
import Signup from './pages/SignUp'
import EditProfile from './pages/user/EditProfile'
import Profile from './pages/user/Profile'



function App() {
 

  return (
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/about' element={<AboutUs/>} />
      <Route path='/signup' element={<Signup/>} />
      <Route path='/login' element={<Signin />} />
       <Route element={<RequireAuth allowedRoles={['ADMIN','USER']} />}>
        <Route path='/user/profile' element={<Profile />} />
        <Route path='/user/editprofile' element={<EditProfile />} />
      </Route>
      <Route path='/courses' element={<CourseList />} />
      <Route path='/courses/descprition' element={<CourseDescription />} />
       <Route element={<RequireAuth allowedRoles={['ADMIN']} />}>
        <Route path='/course/create' element={<CreateCourse />} />
      </Route>
      
      <Route path='/contact' element={<Contact/>} />
      <Route path='/denied' element={<Denied/>} />
      <Route path='*' element={<NotFound/>} />

    </Routes>
  )
}

export default App
 