import React, { useEffect, useState } from 'react'
import './style/heroStyle.scss'

export default function Landing() {

    return (
        <div className='landing-container-main'>

            <div className="landing-component">
                <div className="who-i-am">
                    <span id='Own'>Hiren Ray</span>
                    <div className="i-desk">
                        <span>Learn Anything AnyTime </span>
                        <span>Jay Baba Bhola Nath</span>

                    </div>
                </div>
                <div className="center-hero">
                    <div className="job-tag">
                        <p>Junior Full Stack Developer</p>
                        <img src="/curved-arrow.png" alt="" style={{ width: "60px" }} />
                    </div>
                    <div className="owener-img">
                        <img src="/hirenray.png" alt="" />
                    </div>
                </div>
                <div className="what-i-do">
                    <span id='Own'>What I Do</span>
                    <div className="i-desk">
                        <span>I Do Every Complex Work in esay way  adn specialy i solved the real world project problem </span>
                        {/* <span>Jay Baba Bhola Nath</span>  */}
                        <div className="l-arroe">
                            <img src="/curved-arrow.png" alt="" style={{ width: "60px" }} />
                        </div>

                    </div>
                </div>
            </div>
            <div className="bottom-hero-content">
                <span id='bottom-span-a'>MANY STARTUP MANY BUISNESS</span>
                <span>& GROWING IN EFECTIVE PRICE</span>
                <span id='bottom-span-a'>WITH GET POSETIVE RESPONSE & RELATION</span>
            </div>
            <div className="optional"></div>
        </div>
    )
}
