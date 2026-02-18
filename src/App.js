import React from 'react'
import Landin from './components/Landing'
import Layout from './components/layout/Layout'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Landing from './components/Landing'
import Hero from './components/Hero'

export default function () {
  
  
  const homelayout =()=> <Layout/>

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout/>,
      children: [
        {index: true, element: <Hero/>}
      ]
    }
  ])





  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}
