import { useLocation, Outlet, Link } from "react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Building2,
  Hotel,
  DoorOpen,
  CalendarCheck,
  ListChecks,
  FileEdit,
  Settings,
  LogOut,
  DollarSign,
  ClipboardList,
  Ban,
  UserCog,
  ChevronDown,
  Bell,
  MessageSquare,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
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

export default function PartnerLayout() {
  const location = useLocation();
  const { t } = useTranslation();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    hotels: location.pathname.startsWith("/partner/hotels"),
    bookings: location.pathname.startsWith("/partner/bookings"),
  });

  const toggleMenu = (menuKey: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <div className="relative">
          <Sidebar className="w-64 border-r border-sidebar-border bg-sidebar group">
            <SidebarHeader className="px-4 py-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=1856&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Hotel Logo"
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-sidebar-ring/10 group-data-[collapsed=true]:h-8 group-data-[collapsed=true]:w-8"
                />
                <div className="flex flex-col group-data-[collapsed=true]:hidden">
                  <span className="text-xs text-muted-foreground">
                    {t("welcome")},
                  </span>
                  <span className="text-sm font-medium text-sidebar-foreground">
                    Grand Hotel
                  </span>
                </div>
              </div>
            </SidebarHeader>

            <div className="px-4">
              <SidebarSeparator className="my-1" />
            </div>

            <SidebarContent className="px-4 py-1">
              <SidebarMenu className="space-y-1">
                {/* Revenue Management */}
                <SidebarMenuItem>
                  <Link to="/partner/">
                    <SidebarMenuButton
                      isActive={location.pathname.startsWith("/partner")}
                      tooltip={t("partner.dashboard.revenue")}
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg group-data-[collapsed=true]:justify-center"
                    >
                      <DollarSign className="h-4 w-4" />
                      <span className="group-data-[collapsed=true]:hidden">
                        {t("partner.dashboard.revenue")}
                      </span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>

                {/* Hotel Management */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={location.pathname.startsWith("/partner/hotels")}
                    tooltip={t("partner.dashboard.hotels")}
                    className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg group-data-[collapsed=true]:justify-center"
                    onClick={() => toggleMenu("hotels")}
                  >
                    <Hotel className="h-4 w-4" />
                    <span className="group-data-[collapsed=true]:hidden">
                      {t("partner.dashboard.hotels")}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 ml-auto transition-transform duration-200 group-data-[collapsed=true]:hidden ${
                        openMenus.hotels ? "transform rotate-180" : ""
                      }`}
                    />
                  </SidebarMenuButton>
                  {openMenus.hotels && (
                    <SidebarMenuSub className="mt-2 space-y-1 group-data-[collapsed=true]:hidden">
                      <SidebarMenuSubItem>
                        <Link to="/partner/hotels/info">
                          <SidebarMenuSubButton
                            isActive={
                              location.pathname === "/partner/hotels/info"
                            }
                            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg"
                          >
                            <Building2 className="h-4 w-4" />
                            <span>{t("partner.hotels.info")}</span>
                          </SidebarMenuSubButton>
                        </Link>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <Link to="/partner/hotels/rooms">
                          <SidebarMenuSubButton
                            isActive={
                              location.pathname === "/partner/hotels/rooms"
                            }
                            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg"
                          >
                            <DoorOpen className="h-4 w-4" />
                            <span>{t("partner.hotels.rooms")}</span>
                          </SidebarMenuSubButton>
                        </Link>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <Link to="/partner/hotels/status">
                          <SidebarMenuSubButton
                            isActive={
                              location.pathname === "/partner/hotels/status"
                            }
                            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg"
                          >
                            <ClipboardList className="h-4 w-4" />
                            <span>{t("partner.hotels.status")}</span>
                          </SidebarMenuSubButton>
                        </Link>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>

                {/* Booking Management */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={location.pathname.startsWith("/partner/bookings")}
                    tooltip={t("partner.dashboard.bookings")}
                    className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg group-data-[collapsed=true]:justify-center"
                    onClick={() => toggleMenu("bookings")}
                  >
                    <CalendarCheck className="h-4 w-4" />
                    <span className="group-data-[collapsed=true]:hidden">
                      {t("partner.dashboard.bookings")}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 ml-auto transition-transform duration-200 group-data-[collapsed=true]:hidden ${
                        openMenus.bookings ? "transform rotate-180" : ""
                      }`}
                    />
                  </SidebarMenuButton>
                  {openMenus.bookings && (
                    <SidebarMenuSub className="mt-2 space-y-1 group-data-[collapsed=true]:hidden">
                      <SidebarMenuSubItem>
                        <Link to="/partner/bookings/list">
                          <SidebarMenuSubButton
                            isActive={
                              location.pathname === "/partner/bookings/list"
                            }
                            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg"
                          >
                            <ListChecks className="h-4 w-4" />
                            <span>{t("partner.bookings.list")}</span>
                          </SidebarMenuSubButton>
                        </Link>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <Link to="/partner/bookings/orders">
                          <SidebarMenuSubButton
                            isActive={
                              location.pathname === "/partner/bookings/orders"
                            }
                            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg"
                          >
                            <FileEdit className="h-4 w-4" />
                            <span>{t("partner.bookings.orders")}</span>
                          </SidebarMenuSubButton>
                        </Link>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <Link to="/partner/bookings/requests">
                          <SidebarMenuSubButton
                            isActive={
                              location.pathname === "/partner/bookings/requests"
                            }
                            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg"
                          >
                            <Ban className="h-4 w-4" />
                            <span>{t("partner.bookings.requests")}</span>
                          </SidebarMenuSubButton>
                        </Link>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>

                {/* Messages */}
                <SidebarMenuItem>
                  <Link to="/partner/messages">
                    <SidebarMenuButton
                      isActive={location.pathname.startsWith(
                        "/partner/messages"
                      )}
                      tooltip={t("partner.dashboard.messages")}
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg group-data-[collapsed=true]:justify-center"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span className="group-data-[collapsed=true]:hidden">
                        {t("partner.dashboard.messages")}
                      </span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>

                {/* Account Management */}
                <SidebarMenuItem>
                  <Link to="/partner/account">
                    <SidebarMenuButton
                      isActive={location.pathname.startsWith(
                        "/partner/account"
                      )}
                      tooltip={t("partner.dashboard.account")}
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg group-data-[collapsed=true]:justify-center"
                    >
                      <UserCog className="h-4 w-4" />
                      <span className="group-data-[collapsed=true]:hidden">
                        {t("partner.dashboard.account")}
                      </span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>

            <div className="px-4">
              <SidebarSeparator className="my-1" />
            </div>

            <SidebarFooter className="px-4 py-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 p-2 cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors group-data-[collapsed=true]:justify-center">
                    <Avatar className="h-10 w-10 ring-2 ring-sidebar-ring/10 group-data-[collapsed=true]:h-8 group-data-[collapsed=true]:w-8">
                      <AvatarImage src="/avatar.png" alt="Partner avatar" />
                      <AvatarFallback>P</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col group-data-[collapsed=true]:hidden">
                      <span className="text-sm font-medium text-sidebar-foreground">
                        Partner Name
                      </span>
                      <span className="text-xs text-muted-foreground">
                        partner@example.com
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
                  <Link to="/partner/profile">
                    <DropdownMenuItem className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer">
                      <UserCog className="mr-2 h-4 w-4 hover:text-sidebar-accent-foreground" />
                      {t("common.personalInfo")}
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/partner/settings">
                    <DropdownMenuItem className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer">
                      <Settings className="mr-2 h-4 w-4 hover:text-sidebar-accent-foreground" />
                      {t("common.settings")}
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/partner/notifications">
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

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4">
            <SidebarTrigger className="mb-2" />
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
