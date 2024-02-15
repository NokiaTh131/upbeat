import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Menu.css";
import start from "../assets/start.png";
import nstart from "../assets/start2.png";
import sett from "../assets/setting.png";
import nsett from "../assets/setting2.png";
import startsfx from "../assets/enter.mp3";

function Menu() {
  const [startImage, setStartImage] = useState(start);
  const [settImage, setSettImage] = useState(sett);
  const [popped, pop] = React.useState(false);

  useEffect(() => {
    if (!popped) return;
    const audio = new Audio(startsfx);
    audio.play();
  }, [popped]);

  const handleMouseIn = () => {
    setStartImage(nstart);
    pop(true);
  };

  const handleMouseOut = () => {
    setStartImage(start);
    pop(false);
  };

  const handleSettClick = () => {
    setSettImage(nsett);
    pop(true);
  };

  const handleSettRelease = () => {
    setSettImage(sett);
    pop(false);
  };

  return (
    <div className="menu">
      <Link
        to="/map"
        onMouseDown={handleMouseIn}
        onMouseUp={handleMouseOut}
        onMouseLeave={handleMouseOut}
      >
        <img
          src={startImage}
          alt="Start"
          onClick={handleMouseIn}
          onMouseUp={handleMouseOut}
        />
      </Link>
      <Link
        to="/leaderboard"
        onMouseDown={handleSettClick}
        onMouseUp={handleSettRelease}
        onMouseLeave={handleSettRelease}
      >
        <img
          src={settImage}
          alt="Settings"
          onClick={handleSettClick}
          onMouseUp={handleSettRelease}
        />
      </Link>
    </div>
  );
}

export default Menu;
