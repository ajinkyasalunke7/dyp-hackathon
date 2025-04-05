import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import UpdateProfilePage from "./pages/Profile/UpdateProfile";
import  Home  from "./pages/Auth/Home";

function App() {
   return (
      <>
         <Routes>
            {/* Auth pages */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected route */}
            <Route path="/update-profile" element={<UpdateProfilePage />} />

            {/* <Route path="/" element={<h1 className="bg-red-400">/ Route</h1>} /> */}
         </Routes>
      </>
   );
}

export default App;
