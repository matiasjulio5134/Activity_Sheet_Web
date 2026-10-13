import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Weeks from "./components/Weeks";
import EditWeek from "./components/EditWeek";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import Toast from "./components/Toast";
import { useEffect, useState } from "react";
function App() {
  // const [userAuthenticatedState, setUserAuthenticatedState] = useState(() => {
  //   return !!localStorage.getItem("token");
  // });

  // Check authentication status on component mount and when localStorage changes
  //useEffect(() => {
  //   const checkAUth = () => {
  //     
  //     setUserAuthenticatedState(!!localStorage.getItem("token"));
  //   };
  //   checkAUth();

  //   window.addEventListener("storage", checkAUth);

  //   return () => window.removeEventListener("storage", checkAUth);
  // }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* <Route element={<ProtectedRoute isAllowed={userAuthenticatedState} />}> */}
          <Route path="/weeks" element={<Weeks />} />
          <Route path="/editweek/:numero/:weekId" element={<EditWeek />} />
        {/* </Route> */}
      </Routes>

      <Toast />
    </BrowserRouter>
  );
}
export default App;
