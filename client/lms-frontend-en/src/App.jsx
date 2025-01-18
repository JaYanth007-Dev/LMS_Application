import './App.css'

import { Route, Routes } from 'react-router-dom'

import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import NotFound from './pages/NotFound'
import Signup from './pages/SignUp'
import Signin from './pages/Signin'
import Contact from './pages/Contact'
import Denied from './pages/Denied'
import CourseList from './pages/course/CourseList'



function App() {
 

  return (
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/about' element={<AboutUs/>} />
      <Route path='/signup' element={<Signup/>} />
      <Route path='/login' element={<Signin/>} />
      <Route path='/courses' element={<CourseList/>} />
      <Route path='/contact' element={<Contact/>} />
      <Route path='/denied' element={<Denied/>} />
      <Route path='*' element={<NotFound/>} />

    </Routes>
  )
}

export default App
 