// HexagonalGrid.jsx
import React, { useState, useEffect } from "react";
import "./HexagonalGrid.css"; // Create a CSS file for styling if needed
import { Alert } from "@mui/material";
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
import Stomp from "stompjs";
import SockJS from "sockjs-client";

function HexagonalGrid() {
  const [zoomLevel, setZoomLevel] = useState(100); // Default zoom level is 100%
  const [player, setPlayer] = React.useState<Player | null>(null);
  const [refreshes, setRefresh] = React.useState<boolean | null>(null);
  const [landed, setLand] = React.useState<ApiResponse | null>(null);
  const [error, setError] = React.useState<Error | null>(null);
  const [constructionPlanText, setConstructionPlanText] =
    useState("Please enter");
  const [showTextEditor, setShowTextEditor] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (refreshes === true) window.location.reload();
  }, [refreshes]);

  React.useEffect(() => {
    const name = getCurrentPlayer();
    if (!name) return navigate("/");
    getPlayer(name)
      .then((response) => {
        setPlayer(response.data);
        // Set the default construction plan text from localStorage or use the default message
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
      .then((response) => setLand(response.data))
      .catch(setError);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if the pressed key is 'Z' or 'X'
      if (event.key === "z" || event.key === "Z") {
        setZoomLevel((prevZoom) => prevZoom + 10); // Increase zoom level by 10%
      } else if (event.key === "x" || event.key === "X") {
        setZoomLevel((prevZoom) => Math.max(10, prevZoom - 10)); // Decrease zoom level by 10%, but keep it at least 10%
      }
    };

    // Add event listener on mount
    window.addEventListener("keydown", handleKeyDown);

    // Remove event listener on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSaveConstructionPlan = () => {
    // Make an API call to set the construction plan text
    setConstructionPlan(player.name, constructionPlanText)
      .then((response) => {
        // Handle success, if needed
        alert(
          "Construction plan saved successfully:" +
            response.data.constructionplan
        );
      })
      .catch((error) => {
        // Handle error, if needed
        console.error("Error saving construction plan:", error);
      })
      .finally(() => {
        // Close the text editor
        setCurConstructionPlan(player.name, constructionPlanText);
        Parse(player.name);
        setRefresh(true);
        setShowTextEditor(false);
      });
  };

  if (!player || !player.bindings || !landed) {
    return null; // or some loading state
  }

  const { rows, cols } = player.bindings;
  const graph = landed?.map.adjacencyMatrix;

  const generateHexagons = () => {
    const hexagons = [];

    const handleClick = (event, playerID, deposit) => {
      // Add your click logic here
      event.target.classList.add("highlighted");
      // Show deposit (you can modify this based on your UI design)
      alert(`Deposit for Player ${playerID}: ${deposit}`);
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
      <div className="hello-text">
        {player.name}: {player.budget}
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
      <button onClick={() => setShowTextEditor(!showTextEditor)}>
        Open Text Editor
      </button>
    </div>
  );
}

export const Component = HexagonalGrid;
