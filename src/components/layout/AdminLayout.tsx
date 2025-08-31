import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { AdminLayoutProps } from "@/types/admin";
import UnsupportedScreen from "./UnsupportedScreen";

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Collapse the sidebar when the viewport is narrower than 960px
    if (windowWidth < 960) {
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(false);
    }
  }, [windowWidth]);

  if (windowWidth < 700) {
    return <UnsupportedScreen />;
  }

  return (
    <div className="min-h-screen bg-app-bg text-text-primary">
      <SidebarProvider
        open={!sidebarCollapsed}
        onOpenChange={(open) => setSidebarCollapsed(!open)}
      >
        <div className="flex min-h-screen w-full overflow-hidden">
          <AdminSidebar />

          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <AdminTopbar
              onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            <main className="flex-1 overflow-auto bg-app-bg">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full p-4 space-y-6"
              >
                {children}
              </motion.div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
