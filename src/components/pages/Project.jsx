import React from 'react'
import '../style/projec.scss'
import Automoving from '../commonUsePage/Automoving'
import ScrollingProject from '../commonUsePage/ScrollingProject'

export default function Project() {
  return (
    <div className='project-container'>
      <div className="project-img">
        {/* <img src="/otherside-yugalabs.png" alt="" /> */}
        <div className="overlay-text">
            <Automoving/>
        </div>
        {/* <ScrollingProject/> */}
      </div>
    </div>
  )
}
