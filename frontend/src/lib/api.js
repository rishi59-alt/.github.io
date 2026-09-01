import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Anonymous per-device client id (persisted). Auth layers on top of this.
function getClientId() {
  let id = localStorage.getItem("chess_client_id");
  if (!id) {
    id = (crypto.randomUUID && crypto.randomUUID()) || `c_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("chess_client_id", id);
  }
  return id;
}

export const CLIENT_ID = getClientId();

export const TOKEN_KEY = "chess_token";
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));

const api = axios.create({ baseURL: API });
api.interceptors.request.use((config) => {
  config.headers["X-Client-Id"] = getClientId();
  const token = getToken();
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

export default api;
