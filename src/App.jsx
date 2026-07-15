import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Weeks from "./components/Weeks";
import EditWeek from "./components/EditWeek";
import "./App.css";
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/weeks" element={<Weeks />} />
                <Route path="/editweek/:numero" element={<EditWeek />}></Route>
            </Routes>
        </BrowserRouter>
    )
}
export default App;