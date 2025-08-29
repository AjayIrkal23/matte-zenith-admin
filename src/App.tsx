import { Provider } from 'react-redux';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { store } from "@/store";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import LoginPage from "@/pages/Login";
import DashboardPage from "@/pages/admin/Dashboard";
import UsersPage from "@/pages/admin/Users";
import ImagesPage from "@/pages/admin/Images";
import LeaderboardPage from "@/pages/admin/Leaderboard";
import NotFound from "./pages/NotFound";

const App = () => (
  <Provider store={store}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout>
                <Navigate to="/admin/dashboard" replace />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminLayout>
                <DashboardPage />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute>
              <AdminLayout>
                <UsersPage />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/images" element={
            <ProtectedRoute>
              <AdminLayout>
                <ImagesPage />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/leaderboard" element={
            <ProtectedRoute>
              <AdminLayout>
                <LeaderboardPage />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          {/* Fallback routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </Provider>
);

export default App;
