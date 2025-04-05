import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import apiRequest from "../../utils/apiRequest";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router";

// Simulated API

const fetchMetaData = () =>
   new Promise((res) =>
      setTimeout(
         () => res({ statusOptions: ["online", "offline", "dnd"] }),
         500
      )
   );

const updateStatusAndProfession = async (data) => {
   try {
      const result = await apiRequest("put", "/api/profile/update", data);
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
   } catch (error) {
      enqueueSnackbar(error, { autoHideDuration: 3000, variant: "error" });
   }
};

const submitStrengthsWeaknesses = async (data) => {
   console.log(data.strengths);
   try {
      const result = await apiRequest("post", "/api/profile/strengths", {
         skill: data.strengths,
      });
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

      const weak_result = await apiRequest("post", "/api/profile/weaknesses", {
         skill: data.weaknesses,
      });
      if (result.data == false) {
         enqueueSnackbar(weak_result.message, {
            autoHideDuration: 2000,
            variant: "error",
         });
      }
      if (weak_result.success == true) {
         enqueueSnackbar(weak_result.message, {
            autoHideDuration: 2000,
            variant: "success",
         });
      }
   } catch (error) {
      enqueueSnackbar(error, { autoHideDuration: 3000, variant: "error" });
   }
};

// Zod validation
const statusSchema = z.object({
   profession: z.string().min(2, "Profession is required"),
   currentStatus: z.enum(["online", "offline", "dnd"]),
});

export default function UpdateProfile() {
   const navigate = useNavigate();
   const [meta, setMeta] = useState({ statusOptions: [] });

   const [strengths, setStrengths] = useState([]);
   const [weaknesses, setWeaknesses] = useState([]);
   const [strengthInput, setStrengthInput] = useState("");
   const [weaknessInput, setWeaknessInput] = useState("");

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm({
      resolver: zodResolver(statusSchema),
      defaultValues: {
         profession: "",
         currentStatus: "online",
      },
   });

   useEffect(() => {
      fetchMetaData().then(setMeta);
   }, []);

   const onUpdateBasic = async (formData) => {
      await updateStatusAndProfession(formData);
   };

   const onFinalSubmit = async () => {
      await submitStrengthsWeaknesses({ strengths, weaknesses });
      alert("Strengths & Weaknesses submitted!");
   };

   const handleKey = (e, type) => {
      if (e.key === "Enter") {
         e.preventDefault();
         const val = type === "strength" ? strengthInput : weaknessInput;
         if (!val.trim()) return;
         if (type === "strength") {
            setStrengths((prev) => [...prev, val]);
            setStrengthInput("");
         } else {
            setWeaknesses((prev) => [...prev, val]);
            setWeaknessInput("");
         }
      }
   };

   const removeItem = (type, index) => {
      if (type === "strength") {
         setStrengths((prev) => prev.filter((_, i) => i !== index));
      } else {
         setWeaknesses((prev) => prev.filter((_, i) => i !== index));
      }
   };

   return (
      <div className="max-w-xl mx-auto mt-10 p-6 border shadow-md rounded space-y-8">
         <h1 className="text-2xl font-bold text-center">Update Profile</h1>

         {/* === Profession & Status === */}
         <form
            onSubmit={handleSubmit(onUpdateBasic)}
            className="space-y-4 border-b pb-6"
         >
            <h2 className="text-lg font-semibold">Basic Info</h2>

            <div>
               <label className="block font-medium">Profession</label>
               <input
                  type="text"
                  {...register("profession")}
                  className="border w-full p-2"
                  placeholder="Enter your profession"
               />
               {errors.profession && (
                  <p className="text-red-500 text-sm mt-1">
                     {errors.profession.message}
                  </p>
               )}
            </div>

            <div>
               <label className="block font-medium">Status</label>
               <select
                  {...register("currentStatus")}
                  className="border p-2 w-full"
               >
                  {meta.statusOptions.map((s, i) => (
                     <option key={i} value={s}>
                        {s}
                     </option>
                  ))}
               </select>
            </div>

            <button
               type="submit"
               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
               Update Profession & Status
            </button>
         </form>

         {/* === Strengths & Weaknesses === */}
         <div className="space-y-4">
            <h2 className="text-lg font-semibold">Strengths & Weaknesses</h2>

            {/* Strengths */}
            <div>
               <label className="block font-medium">
                  Strengths (Press Enter to add)
               </label>
               <input
                  value={strengthInput}
                  onChange={(e) => setStrengthInput(e.target.value)}
                  onKeyDown={(e) => handleKey(e, "strength")}
                  className="border p-2 w-full mb-2"
                  placeholder="Type and press Enter"
               />
               <div className="flex flex-wrap gap-2">
                  {strengths.map((item, idx) => (
                     <span
                        key={idx}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2"
                     >
                        {item}
                        <button onClick={() => removeItem("strength", idx)}>
                           &times;
                        </button>
                     </span>
                  ))}
               </div>
            </div>

            {/* Weaknesses */}
            <div>
               <label className="block font-medium">
                  Weaknesses (Press Enter to add)
               </label>
               <input
                  value={weaknessInput}
                  onChange={(e) => setWeaknessInput(e.target.value)}
                  onKeyDown={(e) => handleKey(e, "weakness")}
                  className="border p-2 w-full mb-2"
                  placeholder="Type and press Enter"
               />
               <div className="flex flex-wrap gap-2">
                  {weaknesses.map((item, idx) => (
                     <span
                        key={idx}
                        className="bg-red-100 text-red-800 px-3 py-1 rounded-full flex items-center gap-2"
                     >
                        {item}
                        <button onClick={() => removeItem("weakness", idx)}>
                           &times;
                        </button>
                     </span>
                  ))}
               </div>
            </div>

            <button
               onClick={onFinalSubmit}
               className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
               Submit Strengths & Weaknesses
            </button>
         </div>
      </div>
   );
}
