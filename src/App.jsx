// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VerifyPage from "./pages/VerifyPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/verify" element={<VerifyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
