import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Weeks from "./components/Weeks";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/weeks" element={<Weeks />} />
            </Routes>
        </BrowserRouter>
    )
}
export default App;