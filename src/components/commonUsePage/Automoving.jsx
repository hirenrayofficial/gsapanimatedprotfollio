import React from 'react'
import './automoving.scss'

export default function Automoving() {
  const items = ["New project", "New project", "New project", "New project"]

  return (
    <div className="ticker">
      <div className="ticker-track">
        {[...items, ...items].map((text, i) => (
          <span key={i}>{text}</span>
        ))}
        
      </div>
      
    </div>
  )
}
