import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Weeks from "./components/Weeks";
import EditWeek from "./components/EditWeek";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import Toast from "./components/Toast";

function App() {
    const userAuthenticated = !!localStorage.getItem("token");

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route element={<ProtectedRoute isAllowed={userAuthenticated} />}>
                    <Route path="/weeks" element={<Weeks />} />
                    <Route
                        path="/editweek/:numero/:weekId"
                        element={<EditWeek />}
                    />
                </Route>
            </Routes>

            <Toast />
        </BrowserRouter>
    );
}

export default App;