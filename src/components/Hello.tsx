import { Alert, Backdrop, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { newPlayer, setCurrentPlayer } from "../repositories";
import { Player } from "../model";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import useWebSocket from "../customHook/useWebSocket.ts";
import { useDispatch } from "react-redux";
import { setUsername as sliceSetUsername } from "../customHook/store/Slices/usernameSlice.ts";

function Hello() {
  const [error, setError] = React.useState<Error | null>(null);
  const [username, setUsername] = useState<string>("");
  const dispatch = useDispatch();
  const { connect } = useWebSocket();

  const navigate = useNavigate();

  function handleSuccess(response: AxiosResponse<Player>) {
    setCurrentPlayer(response.data.name);
    navigate("/game");
  }

  function handleError(error: Error) {
    console.error(error);
    setError(error);
  }

  function handleClicked(name: string) {
    newPlayer(name).then(handleSuccess).catch(handleError);
  }

  // useEffect(() => {
  //   newPlayer(askForName()).then(handleSuccess).catch(handleError);
  // }, []);
  return (
    <>
      <div className="w-full max-w-xs">
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmitCapture={(e) => {
            e.preventDefault();
            dispatch(sliceSetUsername(username));
            connect(username);
            alert(username);
            handleClicked(username);
          }}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Enter your name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Join Chat
            </button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs">
          &copy;2020 Acme Corp. All rights reserved.
        </p>
      </div>
    </>
  );
}

export const Component = Hello;
