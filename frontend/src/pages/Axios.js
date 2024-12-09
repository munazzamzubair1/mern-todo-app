// Import necessary modules
import axios from "axios";
import { API_URL } from "../components/config";

// Create an instance of axios
const Axios = axios.create({
  baseURL: API_URL,
});

export default Axios;
