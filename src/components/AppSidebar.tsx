import { Link, useLocation } from "react-router";
import { CloudSun, Home, CloudSunRain } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/forecast", label: "Forecast", icon: CloudSunRain },
];

function AppSidebar() {
  const { pathname } = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3">
          <CloudSun className="size-6 shrink-0 text-sky-500" />
          {!isCollapsed && (
            <span className="font-semibold text-sm tracking-wide truncate">
              WeatherCast
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="gap-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <SidebarMenuItem
              key={to}
              className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
            >
              <SidebarMenuButton
                render={<Link to={to} />}
                isActive={pathname === to}
                tooltip={label}
                className="py-3 px-3 gap-3"
              >
                <Icon className="size-5 shrink-0" />
                <span>{label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
