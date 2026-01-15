import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/MainLayout';
import { DashboardLayout } from './app/dashboard/DashboardLayout';
import { AdminLayout } from './app/admin/AdminLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardPage from './app/dashboard/page';
import BuilderPage from './app/builder/page';
import PreviewPage from './app/preview/page';
import PublishFormPage from './app/publish/page';
import AdminOverview from './app/admin/page';
import UsersPage from './app/admin/UsersPage';
import FormsPage from './app/admin/FormsPage';
import AuthCallback from './pages/AuthCallback';
import FormResponsesPage from './app/dashboard/responses/page';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Route>

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="forms/:formId/responses" element={<FormResponsesPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="forms" element={<FormsPage />} />
        </Route>

        <Route path="/builder/:id" element={<BuilderPage />} />
        <Route path="/preview" element={<PreviewPage />} />

        <Route path="/:username/:formSlug" element={<PublishFormPage />} />
      </Routes>
    </Router>
  );
};

export default App;
