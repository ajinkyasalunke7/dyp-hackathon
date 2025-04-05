import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const api = axios.create({
   baseURL: baseURL,
   withCredentials: true,
   headers: {
      "Content-Type": "application/json",
   },
});

const apiRequest = async (method, url, data = null, headers = {}) => {
   try {
      const response = await api({
         method: method,
         url: url,
         data: data,
         headers: headers,
      });
      return response.data; // Return only the data from the response
   } catch (error) {
      // Handle errors (you might want to customize this)
      if (error.response) {
         // The request was made and the server responded with a status code
         // that falls out of the range of 2xx
         console.error("API Error:", error.response.data);
         throw error.response.data; // Throw the error data for component-level handling
      } else if (error.request) {
         // The request was made but no response was received
         console.error("Network Error:", error.request);
         throw new Error("Network error. Please check your connection.");
      } else {
         // Something happened in setting up the request that triggered an Error
         console.error("Request Error:", error.message);
         throw new Error("An unexpected error occurred.");
      }
   }
};

export default apiRequest;
