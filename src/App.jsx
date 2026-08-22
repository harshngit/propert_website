import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CityLandingPage from "./pages/CityLandingPage";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import RoutePage from "./pages/RoutePage";
import DropdownBlankPage from "./pages/DropdownBlankPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/city/:citySlug" element={<CityLandingPage />} />
      <Route path="/properties" element={<PropertiesPage />} />
      <Route path="/properties/:id" element={<PropertyDetailPage />} />
      <Route
        path="/console"
        element={
          <RoutePage
            title="Console"
            description="Access your broker, agency, or admin console tools from one place."
          />
        }
      />
      <Route path="/buy/institutional-properties" element={<DropdownBlankPage />} />
      <Route path="/buy/bank-auction-properties" element={<DropdownBlankPage />} />
      <Route path="/buy/special-situation-properties" element={<DropdownBlankPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/services/get-involved" element={<DropdownBlankPage />} />
      <Route path="/news-guide/insights-guides" element={<DropdownBlankPage />} />
      <Route path="/news-guide/opened-through-the-blog-listing" element={<DropdownBlankPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
