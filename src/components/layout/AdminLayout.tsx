import { useState } from "react";
import { motion } from "framer-motion";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { AdminLayoutProps } from "@/types/admin";

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-app-bg text-text-primary">
      <SidebarProvider defaultOpen={!sidebarCollapsed}>
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
