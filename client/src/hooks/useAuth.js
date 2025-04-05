// hooks/useAuth.js
import useSWR from "swr";
import axios from "axios";

const fetcher = async () => {
   const result = await axios.get("http://localhost:5000/api/auth/me", {
      withCredentials: true,
   });
   console.log("User fetched:", result.data.data); // log user data
   return result.data.data; // return only the user object
};

export const useAuth = () => {
   const { data, error, isLoading } = useSWR(
      "auth/me", // SWR key — can be any unique string
      fetcher
   );

   return {
      user: data,
      isLoading,
      isError: error,
      isAuthenticated: !!data && !error,
   };
};
