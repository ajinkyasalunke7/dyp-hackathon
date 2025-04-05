import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import UpdateProfilePage from "./pages/Profile/UpdateProfile";
import Home from "./pages/Auth/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Me from "./pages/Auth/Me";
import MatchMakingPage from "./pages/PeerToPeer/MatchMakingPage";

function App() {
   return (
      <>
         <Routes>
            {/* Auth pages */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/me" element={<Me />} />

            {/* Protected route */}
            <Route
               path="/update-profile"
               element={
                  <ProtectedRoute>
                     <UpdateProfilePage />
                  </ProtectedRoute>
               }
            />
            <Route
               path="/search-peer"
               element={
                  <ProtectedRoute>
                     <MatchMakingPage />
                  </ProtectedRoute>
               }
            />

            {/* <Route path="/" element={<h1 className="bg-red-400">/ Route</h1>} /> */}
         </Routes>
      </>
   );
}

export default App;
