import Stomp from "stompjs";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import SockJS from "sockjs-client/dist/sockjs";
import { useAppDispatch, useAppSelector } from "../customHook/store/hooks.ts";
import {
  setIsConnected,
  appendMessage,
  setStompClient,
} from "../customHook/store/Slices/webSocketSlice.ts";
import { selectWebSocket } from "../customHook/store/Slices/webSocketSlice.ts";

function useWebSocket() {
  const dispatch = useAppDispatch();
  const webSocket = useAppSelector(selectWebSocket);

  function connect(username: string) {
    try {
      const socket: WebSocket = new SockJS(`http://localhost:8080/ws`);
      const stompClient: Stomp.Client = Stomp.over(socket);
      stompClient.connect(
        {},
        () => onConnected(stompClient, username),
        onError
      );
    } catch (e) {
      console.log(e);
    }
  }

  function sendMessage(message: string, username: string) {
    if (webSocket.stompClient && webSocket.stompClient.connected) {
      const chatMessage = {
        sender: username,
        content: message,
        timestamp: new Date().toLocaleTimeString(),
        type: "CHAT",
      };
      webSocket.stompClient.send(
        "/app/menu.sendMessage",
        {},
        JSON.stringify(chatMessage)
      );
    }
  }

  function updateMap() {
    if (webSocket.stompClient && webSocket.stompClient.connected) {
      webSocket.stompClient.send("/app/map.sendUpdate");
    }
  }
  const onConnected = (stompClient: Stomp.Client, username: string) => {
    stompClient.subscribe("/topic/menupublic", onMessageReceived);
    stompClient.send(
      "/app/menu.addUser",
      {},
      JSON.stringify({
        sender: username,
        type: "JOIN",
        timestamp: new Date().toLocaleTimeString(),
      })
    );
    dispatch(setIsConnected(true));
    dispatch(setStompClient(stompClient));
  };
  const onMessageReceived = (payload: Stomp.Message) => {
    dispatch(appendMessage(JSON.parse(payload.body)));
  };
  return { connect, sendMessage, updateMap };
}

export default useWebSocket;

const onError = (err: Stomp.Message) => {
  console.log(err);
};
