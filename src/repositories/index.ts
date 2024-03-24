import { Player } from "../model";
import axios, { AxiosResponse } from "axios";
import { ApiResponse } from "../model";

export type Response<T> = Promise<AxiosResponse<T>>;
function getAxiosInstance() {
  return axios.create({ baseURL: getServer() });
}

export function newLand(): Response<ApiResponse> {
  return getAxiosInstance().post(`/land`);
}

export function newPlayer(name: string): Response<Player> {
  return getAxiosInstance().post(`/player`, encodeURIComponent(name));
}

export function getPlayer(name: string): Response<Player> {
  return getAxiosInstance().get(`/player/${encodeURIComponent(name)}`);
}

export function getLand(): Response<ApiResponse> {
  return getAxiosInstance().get(`/land`);
}

export function getLeaderboard(): Response<Player[]> {
  return getAxiosInstance().get("/player/leaderboard");
}

export function getCurrentPlayer(): string | null {
  return window.localStorage.getItem("player");
}

export function setCurrentPlayer(player: string | null): void {
  if (!player) return window.localStorage.removeItem("player");
  window.localStorage.setItem("player", player);
}

export function getServer(): string {
  return window.localStorage.getItem("server") || import.meta.env.VITE_SERVER;
}

export function setServer(server: string | null): void {
  if (!server) return window.localStorage.removeItem("server");
  window.localStorage.setItem("server", server);
}

export function getCurLand(): string | null {
  return window.localStorage.getItem("land");
}

export function setCurLand(land: Player[] | null): void {
  if (!land) return window.localStorage.removeItem("land");
  window.localStorage.setItem("land", "i am land");
}

export function setConstructionPlan(
  name: string,
  constructionplan: string
): Response<Player> {
  return getAxiosInstance().put(
    `/player/${encodeURIComponent(name)}/constructionplan`,
    constructionplan, // Send the string directly without double quotes
    {
      headers: {
        "Content-Type": "text/plain", // Set the content type to plain text
      },
    }
  );
}

export function setCurConstructionPlan(
  name: string,
  constructionPlan: string
): void {
  if (!constructionPlan) {
    window.localStorage.removeItem(`constructionPlan_${name}`);
  } else {
    window.localStorage.setItem(`constructionPlan_${name}`, constructionPlan);
  }
}

export function getCurConstructionPlan(name: string): string | null {
  return window.localStorage.getItem(`constructionPlan_${name}`);
}

export function Parse(name: string): Promise<void> {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
      .post(`/player/${encodeURIComponent(name)}/parse`)
      .then((response) => {
        // Optionally, you can handle response data here if needed
        resolve(); // Resolve the promise since request is successful
      })
      .catch((error) => {
        reject(error); // Reject the promise if there's an error
      });
  });
}

export function StartGame(): void {
  getAxiosInstance().post("/newGame");
}

export function playerReady(): void {
  getAxiosInstance().put("/newGame");
}
