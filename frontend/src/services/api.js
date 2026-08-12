import axios from "axios";

const api = axios.create({
  baseURL: "https://sentinelai-backend-n89h.onrender.com",
});

export default api;