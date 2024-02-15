import Bg from "../assets/main.png";
import Title from "../assets/title.png";
import Earth from "../assets/earth.png";
import Mainbgm from "../assets/Mbgm.mp3";

import React, { useEffect } from "react";
import "./Game.css";
// import { getCurrentPlayer, playerClick } from "../repositories";
// import { useNavigate } from "react-router-dom";
// import { Alert } from "@mui/material";
import Menu from "./Menu.tsx";

function Game() {
  const popped = false;
  useEffect(() => {
    const audio = new Audio(Mainbgm);
    audio.volume = 0.02;

    if (!popped) {
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
    }

    return () => {
      // Cleanup
      audio.pause();
      audio.currentTime = 0;
    };
  }, [popped]);

  return (
    <div className="game">
      <div style={{ position: "relative" }}>
        <img
          src={Bg}
          style={{ width: "1280px", height: "auto" }}
          alt="Background"
        />
        <img
          src={Title}
          alt="Title"
          style={{
            position: "absolute",
            top: "28%",
            left: "50%",
            transform: "translate(-50%, -50%) scale(1)",
            animation: "pulsateInfinitely 2s ease-in-out infinite", // 2s duration, ease-in-out timing, infinite loop
          }}
        />

        {/* CSS Keyframes for the Infinite Pulsating Animation */}
        <style>
          {`
      @keyframes pulsateInfinitely {
        0%, 100% {
          transform: translate(-50%, -50%) scale(1);
        }
        50% {
          transform: translate(-50%, -50%) scale(1.1);
        }
      }
    `}
        </style>
        <img
          src={Earth}
          alt="Earth"
          style={{
            position: "absolute",
            top: "78%",
            left: "31%",
            transform: "translate(-50%, -50%)",
            width: "700px", // Adjust the size as needed
            height: "auto",
            animation: "spin 30s linear infinite", // 10s duration, linear timing, infinite loop
          }}
        />
        <Menu />
        {/* CSS Keyframes for the Spin Animation */}
        <style>
          {`
            @keyframes spin {
            from {
            transform: rotate(0deg);
            }
            to {
            transform: rotate(360deg);
            }
            }
        `}
        </style>
      </div>
    </div>
  );
}

export const Component = Game;
