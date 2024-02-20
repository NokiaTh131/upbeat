// HexagonalGrid.jsx
import React, { useState, useEffect } from "react";
import "./HexagonalGrid.css"; // Create a CSS file for styling if needed
import { Player, ApiResponse } from "../model";
import {
  getCurrentPlayer,
  getPlayer,
  getCurLand,
  getLand,
  setConstructionPlan,
  getCurConstructionPlan,
  setCurConstructionPlan,
  Parse,
} from "../repositories";
import { useNavigate } from "react-router-dom";
import home from "../assets/home.png";
import castle from "../assets/castle.png";
import "./NotificationModal.css";
import useWebSocket from "../customHook/useWebSocket.ts";
import { useAppSelector } from "../customHook/store/hooks.ts";
import { selectUsername } from "../customHook/store/Slices/usernameSlice.ts";
import {
  selectWebSocket,
  messageType,
} from "../customHook/store/Slices/webSocketSlice.ts";
import ChatBox from "../customHook/ChatBox.tsx";

function HexagonalGrid() {
  const [zoomLevel, setZoomLevel] = useState(100); // Default zoom level is 100%
  const [player, setPlayer] = React.useState<Player | null>(null);
  const [landed, setLand] = React.useState<ApiResponse | null>(null);
  const [error, setError] = React.useState<Error | null>(null);
  const [constructionPlanText, setConstructionPlanText] =
    useState("Please enter");
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [editTimer, setEditTimer] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const { sendMessage } = useWebSocket();
  const username = useAppSelector(selectUsername);
  const webSocketState = useAppSelector(selectWebSocket);

  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (editTimer) {
        clearInterval(editTimer);
      }
    };
  }, [editTimer, showTextEditor]);

  React.useEffect(() => {
    const name = username;
    if (!name) return navigate("/");
    getPlayer(name)
      .then((response) => {
        setPlayer(response.data);
        const storedConstructionPlan = getCurConstructionPlan(name);
        setConstructionPlanText(
          storedConstructionPlan ||
            response.data?.constructionplan ||
            "Please input your construction plan"
        );
      })
      .catch(setError);
  }, []);

  React.useEffect(() => {
    const landd = getCurLand();
    if (!landd) return navigate("/");
    getLand()
      .then((response) => {
        setLand(response.data);
        getPlayer(username);
      })
      .catch(setError);
  }, []);

  React.useEffect(() => {
    const name = username;
    if (!name) return navigate("/");
    getPlayer(name)
      .then((response) => {
        setPlayer(response.data);
      })
      .catch(setError);

    const landd = getCurLand();
    if (!landd) return navigate("/");
    getLand()
      .then((response) => setLand(response.data))
      .catch(setError);
  }, [[webSocketState.messages]]);

  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if the pressed key is 'Z' or 'X'
      if (event.key === "z" || event.key === "Z") {
        setZoomLevel((prevZoom) => prevZoom + 10); // Increase zoom level by 10%
      } else if (event.key === "x" || event.key === "X") {
        setZoomLevel((prevZoom) => Math.max(10, prevZoom - 10)); // Decrease zoom level by 10%, but keep it at least 10%
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSaveConstructionPlan = () => {
    setConstructionPlan(player.name, constructionPlanText)
      .then((response) => {
        setCurConstructionPlan(player.name, constructionPlanText);
        Parse(player.name);
        sendMessage("refreshMap", player.name);
        alert("Construction plan saved successfully");
      })
      .catch((error) => {
        alert("error saving construction plan");
        handleSaveConstructionPlan();
      })
      .finally(() => {
        // Close the text editor
        setShowTextEditor(false);
      });
  };

  if (!player || !player.bindings || !landed) {
    return null; // or some loading state
  }

  const { rows, cols } = player.bindings;
  const { plan_rev_min, plan_rev_sec } = landed;
  const graph = landed?.map.adjacencyMatrix;

  const handleOpenTextEditor = () => {
    setCountdown(plan_rev_min * 60 + plan_rev_sec);
    setShowTextEditor(true);
    if (editTimer) {
      clearInterval(editTimer);
    }
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown > 0) {
          return prevCountdown - 1;
        } else {
          // Clear the interval when countdown reaches 0
          setShowTextEditor(false);
          clearInterval(timer);
          handleSaveConstructionPlan();
          return 0;
        }
      });
    }, 1000);

    // Save the timer reference to state
    setEditTimer(timer);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const generateHexagons = () => {
    const hexagons = [];

    const handleClick = (event, playerID, deposit) => {
      event.target.classList.add("highlighted");
      setNotificationMessage(
        `Deposit of ${playerID}: ${Number(Math.abs(deposit)).toFixed(2)}`
      );
      setShowNotification(true);
    };

    const handleMouseOver = (event) => {
      // Add your glow effect logic here
      event.target.classList.add("glow");
    };

    const handleMouseLeave = (event) => {
      // Remove highlighting and glow logic here
      event.target.classList.remove("highlighted", "glow");
    };

    for (let row = 1; row <= rows; row++) {
      for (let column = 1; column <= cols; column++) {
        const isEvenColumn = column % 2 === 0;
        const cell = graph[row - 1]?.[column - 1];
        if (!cell) {
          continue;
        }
        const { player_Id, deposit, p, citycenter } = cell;
        const classNames = `hex ${isEvenColumn ? "even-column" : ""}`;
        hexagons.push(
          <div
            key={`hex-${row}-${column}`}
            className={classNames}
            data-row={row}
            data-column={column}
            onClick={(event) => handleClick(event, p.name, deposit)}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
          >
            {player_Id !== 0 && (
              <img
                src={citycenter ? castle : home}
                alt={`House for Player ${player_Id}`}
                className={citycenter ? "castle-image" : "house-image"}
                style={{ filter: `hue-rotate(${player_Id * 30}deg)` }}
              />
            )}
          </div>
        );
      }
    }

    return hexagons;
  };

  return (
    <div>
      {/* <ChatBox /> */}
      {showTextEditor && (
        <div className="time-text">
          {`Time remaining: ${formatTime(countdown)}`}
        </div>
      )}
      <div className="hello-text">
        {player.name}: {player.budget} Turn : {player.bindings.t}
        <img
          src={castle}
          className="castle-forshow"
          style={{ filter: `hue-rotate(${player.id * 30}deg)` }}
        />
      </div>
      <div
        className="hex-grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          zoom: `${zoomLevel}%`,
        }}
      >
        {generateHexagons()}
      </div>
      {showTextEditor && (
        <div className="text-editor-overlay">
          <div className="text-editor">
            <textarea
              value={constructionPlanText}
              onChange={(e) => setConstructionPlanText(e.target.value)}
            />
            <button onClick={handleSaveConstructionPlan}>
              Save Construction Plan
            </button>
          </div>
        </div>
      )}

      {showNotification && (
        <div className="notification-modal">
          <div className="notification-content">
            <p>{notificationMessage}</p>
            <button onClick={() => setShowNotification(false)}>Close</button>
          </div>
        </div>
      )}
      <button onClick={handleOpenTextEditor}>Open Text Editor</button>
    </div>
  );
}

export const Component = HexagonalGrid;
