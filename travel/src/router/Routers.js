

import React from 'react'
import {Routes, Route, Navigate} from'react-router-dom'

import Home from '../pages/Home'

import Login from '../pages/Login'
import Register from '../pages/Register'




const Router = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to='/home'/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />

      </Routes>
    </div>
  )
}

export default Router
