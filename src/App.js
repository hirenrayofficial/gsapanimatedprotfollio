import React from 'react'

import Layout from './components/layout/Layout'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Hero from './components/Hero'
import Blog from './pages/blog/Blog'
import BlogLayout from './blog/component/BlogLayout'
import CreateBlog from './blog/component/editor/CreateBlog'
import BlogPostReader from './blog/component/BlogPostReader'
import AIblogMaker from './blog/component/AIblogMaker'
import Contact from './pages/details/Contact'
import About from './pages/details/About'
import PrivacyPolicy from './pages/details/PrivacyPolicy'
import Cookie  from "./pages/details/CookieConsent"
import Terms from "./pages/details/TermsOfService"
export default function App() {



  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <Hero /> },
        { path: "contact", element: <Contact /> },
        { path: "about", element: <About /> },
        { path: "privacy", element: <PrivacyPolicy /> },
        { path: "terms", element: <Terms /> }
      ]
    },
    {
      path: "/blog",
      element: <BlogLayout />,
      children: [
        { index: true, element: <Blog /> },
        {
          path: "create",
          children: [
            { index: true, element: <CreateBlog /> },
            { path: "ai", element: <AIblogMaker /> }
          ]
        },
        { path: ":slug", element: <BlogPostReader /> }
      ]
    }
  ])





  return (
    <div>
      <Cookie/>
      <RouterProvider router={router} />
    </div>
  )
}
