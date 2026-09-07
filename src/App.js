import React from 'react'

import Layout from './components/layout/Layout'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Hero from './components/Hero'
import Blog from './pages/blog/Blog'
import BlogLayout from './blog/component/BlogLayout'
import CreateBlog from './blog/component/editor/CreateBlog'
import BlogPostReader from './blog/component/BlogPostReader'
import AIblogMaker from './blog/component/AIblogMaker'

export default function App() {



  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <Hero /> }
      ]
    },
    {
      path: "/blog",
      element: <BlogLayout />,
      children: [
        { index: true, element: <Blog /> },
        { path: "create", element: <CreateBlog /> },
        { path: ":slug", element: <BlogPostReader /> },
        {path: "aimaker",element:<AIblogMaker/>}
      ]
    }
  ])





  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}
