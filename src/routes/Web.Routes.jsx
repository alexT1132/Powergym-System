import { Routes, Route } from "react-router-dom";
import Indexpage from "../pages/Index";
import LoginPage from "../pages/Login";
import RegistroPage from "../pages/registro";

function web() {
  return (
    <Routes>
        <Route index path="/" element={<Indexpage />} />
        <Route index path="/login" element={<LoginPage />} />
        <Route index path="/registro" element={<RegistroPage />} />
    </Routes>
  )
}

export default web;