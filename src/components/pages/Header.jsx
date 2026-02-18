import React from 'react'
import '../style/header.scss'
export default function Header() {
  return (
    <div className='header-container'>
        <div className="left-header">
            <span>RAY</span>
        </div>
        <div className="center-header">
            <div className="link-header">
                <a href="/about">About</a>
            </div>
            <div className="link-header">
                <a href="/about">Project</a>
            </div>
            <div className="link-header">
                <a href="/about">Contact</a>
            </div>
        </div>
        <div className="right-header">
            <div className="link-header">
                <a href="/talk">Talk</a>
            </div>
        </div>

    </div>
  )
}
