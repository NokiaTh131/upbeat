// HexagonalGrid.jsx
import React, { useState, useEffect } from "react";
import "./HexagonalGrid.css"; // Create a CSS file for styling if needed
import { Alert } from "@mui/material";
import { Player } from "../model";
import { getCurrentPlayer, getPlayer } from "../repositories";
import { useNavigate } from "react-router-dom";
function HexagonalGrid() {
  const [zoomLevel, setZoomLevel] = useState(100); // Default zoom level is 100%
  const [player, setPlayer] = React.useState<Player | null>(null);
  const [error, setError] = React.useState<Error | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const name = getCurrentPlayer();
    if (!name) return navigate("/");
    getPlayer(name)
      .then((response) => setPlayer(response.data))
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
  if (!player || !player.bindings) {
    return null; // Return early if player or bindings are not available
  }

  const { rows, cols } = player.bindings;

  const generateHexagons = () => {
    const hexagons = [];

    for (let row = 1; row <= rows; row++) {
      for (let column = 1; column <= cols; column++) {
        const isEvenColumn = column % 2 === 0;
        const classNames = `hex ${isEvenColumn ? "even-column" : ""}`;
        hexagons.push(
          <div
            key={`hex-${row}-${column}`}
            className={classNames}
            data-row={row}
            data-column={column}
          ></div>
        );
      }
    }

    return hexagons;
  };

  return (
    <div
      className="hex-grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        zoom: `${zoomLevel}%`,
      }}
    >
      {generateHexagons()}
    </div>
  );
}

export const Component = HexagonalGrid;
