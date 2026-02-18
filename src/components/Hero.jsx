import React from 'react'
import Landing from './Landing'
import Project from './pages/Project'
import PageSlider from './commonUsePage/SliderPages'
import ScrollingProject from './commonUsePage/ScrollingProject'
import Cursor from './commonUsePage/Cursor'

export default function Hero() {
  return (
    <div>
      <Cursor/>
      <Landing />
      <Project />
      {/* <ScrollingProject/> */}
      {/* <PageSlider /> */}
    </div>
  )
}
