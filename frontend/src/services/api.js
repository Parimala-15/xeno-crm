import axios from "axios";

const API = axios.create({
  baseURL: "https://xeno-crm-backend-uayh.onrender.com",
});

export default API;
