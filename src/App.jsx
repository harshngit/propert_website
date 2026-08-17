import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import RoutePage from "./pages/RoutePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/properties" element={<PropertiesPage />} />
      <Route path="/properties/:id" element={<PropertyDetailPage />} />
      <Route
        path="/buy"
        element={
          <RoutePage
            title="Buy Properties"
            description="Browse verified homes, premium inventory, and curated deals designed to make your purchase decision faster and clearer."
          />
        }
      />
      <Route
        path="/rent"
        element={
          <RoutePage
            title="Rent Properties"
            description="Explore rental listings with the same verified, high-trust experience and a cleaner path to the right home."
          />
        }
      />
      <Route
        path="/sell"
        element={
          <RoutePage
            title="Sell Property"
            description="List your property with guided steps, better visibility, and a premium presentation that helps serious buyers move faster."
          />
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/services"
        element={
          <RoutePage
            title="Services"
            description="Explore home loans, legal support, special situation properties, and the broader property services stack."
          />
        }
      />
      <Route
        path="/news-guide"
        element={
          <RoutePage
            title="News & Guide"
            description="Read practical guides, market insights, and market-facing content to help you make better real estate decisions."
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
