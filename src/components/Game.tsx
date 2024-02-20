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
import { useAppSelector } from "../customHook/store/hooks.ts";
import { selectUsername } from "../customHook/store/Slices/usernameSlice.ts";
import {
  selectWebSocket,
  messageType,
} from "../customHook/store/Slices/webSocketSlice.ts";
import useWebSocket from "../customHook/useWebSocket.ts";

import JoinLeaveMessage from "../customHook/joinLeaveMessage.tsx";

function Game() {
  const popped = false;
  const username = useAppSelector(selectUsername);
  const webSocketState = useAppSelector(selectWebSocket);
  const { connect } = useWebSocket();
  console.log("WebSocket Connected:", connect);

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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <img
            src={Title}
            alt="Title"
            style={{
              position: "absolute",
              top: "12%", // Adjust the top value as needed
              left: "50%",
              transform: "translate(-50%, -50%) scale(1)",
              animation: "pulsateInfinitely 2s ease-in-out infinite",
              width: "30%",
            }}
          />

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
              top: "38%", // Adjust the top value as needed
              transform: "translate(-50%, -50%)",
              width: "700px", // Adjust the size as needed
              height: "auto",
              animation: "spin 30s linear infinite", // 10s duration, linear timing, infinite loop
            }}
          />

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
          <div className="centered-container">
            {webSocketState.messages?.map((message, index) => {
              return (
                <JoinLeaveMessage
                  sender={message.sender}
                  messageType={message.type}
                  key={index}
                  timestamp={message.timestamp}
                />
              );
            })}
          </div>
          <Menu />
        </div>
      </div>
    </div>
  );
}

export const Component = Game;
