import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./components/SignIn";
import Code from "./components/Code";
import AddFile from "./components/MainPage/AddFile";
import PrivateRoute from "./components/PrivateRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/signin" element={<SignIn />} />

                <Route path="/code" element={<Code />} />

                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <AddFile />
                        </PrivateRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
