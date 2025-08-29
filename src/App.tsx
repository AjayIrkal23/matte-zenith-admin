import { Provider } from 'react-redux';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { store } from "@/store";
import { AdminLayout } from "@/components/layout/AdminLayout";
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
          {/* Redirect root to admin users page */}
          <Route path="/" element={<Navigate to="/admin/users" replace />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout><Navigate to="/admin/users" replace /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><UsersPage /></AdminLayout>} />
          <Route path="/admin/images" element={<AdminLayout><ImagesPage /></AdminLayout>} />
          <Route path="/admin/leaderboard" element={<AdminLayout><LeaderboardPage /></AdminLayout>} />
          
          {/* Fallback routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </Provider>
);

export default App;
