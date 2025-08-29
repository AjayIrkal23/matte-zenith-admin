import { NavLink, useLocation } from 'react-router-dom';
import { Users, Images, Trophy, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
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
} from '@/components/ui/sidebar';

const navigationItems = [
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
    description: 'Manage user accounts',
  },
  {
    title: 'Images',
    href: '/admin/images',
    icon: Images,
    description: 'Review safety images',
  },
  {
    title: 'Leaderboard',
    href: '/admin/leaderboard',
    icon: Trophy,
    description: 'Performance rankings',
  },
];

export function AdminSidebar() {
  const location = useLocation();
  const { open } = useSidebar();

  const isActive = (href: string) => location.pathname === href;

  return (
    <Sidebar className="border-r border-panel-border bg-panel-bg">
      <SidebarHeader className="p-4 border-b border-panel-border">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-8 h-8 bg-adani-primary rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          {open && (
            <div>
              <h1 className="text-lg font-semibold text-text-primary">Adani Admin</h1>
              <p className="text-xs text-text-muted">Safety Dashboard</p>
            </div>
          )}
        </motion.div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-text-muted px-3 py-2 text-xs font-medium uppercase tracking-wider">
            Management
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                          isActive 
                            ? 'bg-adani-primary/20 text-adani-primary border border-adani-primary/30' 
                            : 'text-text-secondary hover:bg-hover-overlay hover:text-text-primary'
                        }`
                      }
                    >
                      <item.icon className={`w-4 h-4 transition-colors ${
                        isActive(item.href) ? 'text-adani-primary' : 'text-text-muted group-hover:text-text-primary'
                      }`} />
                      {open && (
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{item.title}</div>
                          <div className={`text-xs truncate ${
                            isActive(item.href) ? 'text-adani-primary/70' : 'text-text-muted'
                          }`}>
                            {item.description}
                          </div>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}