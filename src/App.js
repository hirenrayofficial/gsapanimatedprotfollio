import React from 'react'

import Layout from './components/layout/Layout'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Hero from './components/Hero'

export default function App () {
  


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
