import './App.css'

import { Route, Routes } from 'react-router-dom'

import Home from './pages/Home'
import AboutUs from './pages/AboutUs'



function App() {
 

  return (
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/about' element={<AboutUs/>} />

    </Routes>
  )
}

export default App
 