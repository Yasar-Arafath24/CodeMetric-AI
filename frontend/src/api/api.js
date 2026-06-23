import axios from "axios";

const api = axios.create({
  baseURL: "https://codemetric-ai-3.onrender.com"
});

export default api;