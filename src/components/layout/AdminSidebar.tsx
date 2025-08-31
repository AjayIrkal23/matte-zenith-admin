import { NavLink, useLocation } from "react-router-dom";
import { Users, Images, Trophy, BarChart3, PenTool } from "lucide-react";
import { motion } from "framer-motion";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: BarChart3,
    description: "Overview & KPIs",
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
    description: "Manage user accounts",
  },
  {
    title: "Images",
    href: "/admin/images",
    icon: Images,
    description: "Review safety images",
  },
  {
    title: "Leaderboard",
    href: "/admin/leaderboard",
    icon: Trophy,
    description: "Performance rankings",
  },
  {
    title: "Annotation",
    href: "/admin/annotation",
    icon: PenTool,
    description: "Image annotation",
  },
];

export function AdminSidebar() {
  const location = useLocation();
  const { open } = useSidebar();

  const isActive = (href: string) => location.pathname === href;

  return (
    <TooltipProvider>
      <Sidebar
        className={`border-r  border-panel-border bg-panel-bg transition-all duration-300 flex-shrink-0 `}
      >
        <SidebarHeader className="p-4 border-b border-panel-border">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Image logo with white background */}
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center overflow-hidden">
              <img
                src="/adani.png" // <-- place your logo in /public/images/
                alt="Adani Logo"
                className="w-14 h-14 object-contain"
              />
            </div>

            {open && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                transition={{ duration: 0.22, delay: 0.1 }}
              >
                <p className="text-sm text-white font-semibold">
                  ROKO TOKO ADMIN
                </p>
              </motion.div>
            )}
          </motion.div>
        </SidebarHeader>

        <SidebarContent className="p-2">
          <SidebarGroup>
            {open && (
              <SidebarGroupLabel className="text-text-muted px-3 py-2 text-xs font-medium uppercase tracking-wider">
                Management
              </SidebarGroupLabel>
            )}

            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {navigationItems.map((item) => {
                  const isCurrentActive = isActive(item.href);

                  const menuButton = (
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.href}
                        className={`relative flex items-center gap-3 px-3 h-[40px] py-2.5 rounded-2xl transition-all duration-220 group ${
                          isCurrentActive
                            ? "bg-adani-primary/20 text-adani-primary border-l-2  border-adani-primary shadow-lg"
                            : "text-text-primary hover:bg-hover-overlay hover:text-text-primary hover:translate-y-[-2px]"
                        } ${!open ? "justify-center" : ""}`}
                      >
                        <item.icon
                          className={`w-5 h-5 transition-all duration-220 ${
                            isCurrentActive
                              ? "text-adani-primary stroke-[2.5]"
                              : "text-text-muted group-hover:text-text-primary group-hover:stroke-[2]"
                          }`}
                        />
                        {open && (
                          <motion.div
                            className="flex-1 min-w-0"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.22, delay: 0.05 }}
                          >
                            <div
                              className={`font-medium text-sm ${
                                isCurrentActive ? "text-adani-primary" : ""
                              }`}
                            >
                              {item.title}
                            </div>
                            <div
                              className={`text-xs truncate ${
                                isCurrentActive
                                  ? "text-adani-primary/70"
                                  : "text-text-muted"
                              }`}
                            >
                              {item.description}
                            </div>
                          </motion.div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  );

                  return (
                    <SidebarMenuItem key={item.href}>
                      {!open ? (
                        <Tooltip>
                          <TooltipTrigger asChild>{menuButton}</TooltipTrigger>
                          <TooltipContent
                            side="right"
                            className="bg-panel-bg border-panel-border"
                          >
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-xs text-text-muted">
                                {item.description}
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        menuButton
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer with DocketRun logo */}
        {/* Footer with DocketRun logo */}
        <div className="mt-auto border-t border-panel-border p-4">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {open && (
              <div className="flex flex-col justify-center w-full  items-center gap-2">
                <p className="text-[10px] text-white">Powered by</p>
                <img
                  src="/docketrun.png" // <-- put your logo path here
                  alt="DocketRun Logo"
                  className="h-5 w-auto"
                />
              </div>
            )}
          </motion.div>
        </div>
      </Sidebar>
    </TooltipProvider>
  );
}
