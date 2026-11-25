import HomePage from "./pages/HomePage.tsx";
import {Route, Routes} from "react-router";
import RegisterPage from "./pages/RegisterPage.tsx";


export function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
        </Routes>
    )
}

export default App