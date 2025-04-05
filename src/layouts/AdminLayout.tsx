import { useLocation, Outlet, Link } from "react-router";
import { useTranslation } from "react-i18next";

import { UserCog, LogOut, Bell, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminLayout() {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background w-full">
        <div className="relative">
          <Sidebar
            className="w-64 border-r border-sidebar-border bg-sidebar group"
            collapsible="icon"
          >
            <SidebarHeader className="px-4 py-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=1856&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Admin Logo"
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-sidebar-ring/10 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8"
                />
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                  <span className="text-xs text-muted-foreground">
                    {t("welcome")},
                  </span>
                  <span className="text-sm font-medium text-sidebar-foreground">
                    Admin Panel
                  </span>
                </div>
              </div>
            </SidebarHeader>

            <div className="px-4 group-data-[collapsible=icon]:px-2">
              <SidebarSeparator className="my-1" />
            </div>

            <SidebarContent className="px-4 py-1 group-data-[collapsible=icon]:px-2">
              <SidebarMenu className="space-y-1">
                {/* Partner Account Management */}
                <SidebarMenuItem>
                  <Link to="/admin/partners">
                    <SidebarMenuButton
                      isActive={location.pathname.startsWith("/admin/partners")}
                      tooltip={t("admin.partners.approval.title")}
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg group-data-[collapsible=icon]:justify-center"
                    >
                      <UserCog className="h-4 w-4" />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {t("admin.partners.approval.title")}
                      </span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>

            <div className="px-4 group-data-[collapsible=icon]:px-2">
              <SidebarSeparator className="my-1" />
            </div>

            <SidebarFooter className="px-4 py-3 group-data-[collapsible=icon]:px-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 p-2 cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors group-data-[collapsible=icon]:justify-center">
                    <Avatar className="h-10 w-10 ring-2 ring-sidebar-ring/10 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
                      <AvatarImage src="/avatar.png" alt="Admin avatar" />
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                      <span className="text-sm font-medium text-sidebar-foreground">
                        Admin Name
                      </span>
                      <span className="text-xs text-muted-foreground">
                        admin@example.com
                      </span>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-sidebar border-sidebar-border"
                >
                  <DropdownMenuLabel className="text-sidebar-foreground">
                    {t("common.account")}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  <Link to="/admin/profile">
                    <DropdownMenuItem className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer">
                      <UserCog className="mr-2 h-4 w-4 hover:text-sidebar-accent-foreground" />
                      {t("common.personalInfo")}
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/admin/settings">
                    <DropdownMenuItem className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer">
                      <Settings className="mr-2 h-4 w-4 hover:text-sidebar-accent-foreground" />
                      {t("common.settings")}
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/admin/notifications">
                    <DropdownMenuItem className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer">
                      <Bell className="mr-2 h-4 w-4 hover:text-sidebar-accent-foreground" />
                      {t("common.notifications")}
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4 hover:text-sidebar-accent-foreground" />
                    {t("common.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarFooter>
          </Sidebar>
        </div>

        <main className="flex-1 flex flex-col p-4">
          <SidebarTrigger className="mb-4" />
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
