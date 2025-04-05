import { Route, Routes } from "react-router-dom";

function App() {
   return (
      <>
         <Routes>
            <Route path="/" element={<h1 className="bg-red-400">/ Route</h1>} />
         </Routes>
      </>
   );
}

export default App;
