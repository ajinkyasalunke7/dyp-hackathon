import React, { useEffect } from "react";
import apiRequest from "../../utils/apiRequest";
import { enqueueSnackbar } from "notistack";
import axios from "axios";

const Me = () => {
   const getUser = async () => {
      try {
         // const result = await apiRequest(
         //    "get",
         //    "http://localhost:5000/api/auth/me"
         // );
         const result = await axios.get("http://localhost:5000/api/auth/me", {
            withCredentials: true,
         });
         console.log("first");
         if (result.data == false) {
            enqueueSnackbar(result.message, {
               autoHideDuration: 2000,
               variant: "error",
            });
         }
         if (result.success == true) {
            enqueueSnackbar(result.message, {
               autoHideDuration: 2000,
               variant: "success",
            });
         }
         //  navigate("/update-profile");
      } catch (error) {
         enqueueSnackbar(error, { autoHideDuration: 3000, variant: "error" });
      }
   };
   useEffect(() => {
      getUser();
   }, []);

   return <div></div>;
};

export default Me;
