import { Outlet } from "react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import { SearchBar } from "./SearchBar";

function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-1 flex-col min-h-svh min-w-0 overflow-x-hidden">
        <div className="z-10 flex items-center gap-3 border-b border-border bg-background/80 backdrop-blur-sm px-4 py-2.5">
          <SidebarTrigger />
          <div className="flex-1">
            <SearchBar />
          </div>
        </div>
        <div className="flex-1 p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}

export default Layout;
