import React, { useEffect } from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

export default function BlogLayout() {
  useEffect(() => {
    // Create the script element
    const script = document.createElement('script')
    script.src = 'https://quge5.com/88/tag.min.js'
    script.async = true
    script.setAttribute('data-zone', '281237')
    script.setAttribute('data-cfasync', 'false')

    // Append the script to the document body (or head)
    document.body.appendChild(script)

    // Cleanup function to remove the script if the component unmounts
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div>
      <header>
        <Header />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}
