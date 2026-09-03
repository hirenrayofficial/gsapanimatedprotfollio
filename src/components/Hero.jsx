import React from "react";
import Landing from "./Landing";
import PageSlider from "./commonUsePage/SliderPages";
import Cursor from "./commonUsePage/Cursor";

import TimelineScrolling from "./projects/TimelineScrolling";
import Project from "./projects/Project";

export default function Hero() {
  return (
    <div>
      <Cursor />
      <Landing />
      <Project/>
      <TimelineScrolling/>
      <PageSlider />

    </div>
  );
}
