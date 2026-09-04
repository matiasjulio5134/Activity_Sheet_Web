import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Weeks from "./components/Weeks";
import EditWeek from "./components/EditWeek";
import "./App.css";
import Toast from "./components/Toast";
function App() {
    return (
        
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/weeks" element={<Weeks />} />
                <Route path="/editweek/:numero/:weekId" element={<EditWeek />}></Route>
            </Routes>
            <Toast/>
        </BrowserRouter>
    )
}
export default App;