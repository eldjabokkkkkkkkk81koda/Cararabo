import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import TvDashboard from "./pages/TvDashboard";
import TvLogin from "./pages/TvLogin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/tv-login" element={<TvLogin />} />
        <Route path="/tv" element={<TvDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
