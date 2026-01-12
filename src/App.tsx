import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/MainLayout';
import { DashboardLayout } from './app/dashboard/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardPage from './app/dashboard/page';
import BuilderPage from './app/builder/page';
import PreviewPage from './app/preview/page';
import PublishFormPage from './app/publish/page';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Dashboard Routes with DashboardLayout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
        </Route>

        {/* Builder Route (No Layout, handles its own) */}
        <Route path="/builder" element={<BuilderPage />} />
        <Route path="/preview" element={<PreviewPage />} />

        {/* Public Form Route */}
        <Route path="/:username/:formSlug" element={<PublishFormPage />} />
      </Routes>
    </Router>
  );
};

export default App;
