import React from 'react'
import { Outlet } from 'react-router-dom'
import Landinloader from '../animetedComponent/LandingLoadin'
import Header from '../pages/Header'
import '../style/Layout.scss'
import Landing from '../Landing'
import Footer from '../pages/Footer'

export default function Layout() {
    return (
        <div>
            {/* <Landinloader> */}
                <header>
                    <Header />
                </header>
                <main>
                    <Outlet />
                </main>
                <footer>
                    <Footer />
                </footer>
            {/* </Landinloader> */}
        </div>
    )
}
