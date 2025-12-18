import { ChevronsUpDown } from "lucide-react";
import Image from "next/image";

import { auth } from "@/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SignIn } from "@/shared/components/SignIn";
import { SignOut } from "@/shared/components/SignOut";

export const AppSidebarUserProfile = async () => {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton className="w-full" asChild>
            <SignIn text="Sign In" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="w-full py-5"
              tooltip={user.name || "User"}
            >
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <span className="text-xs font-medium">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              )}
              <div className="flex flex-col items-start overflow-hidden">
                <span className="truncate font-medium">{user.name}</span>
              </div>
              <ChevronsUpDown className="ml-auto group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="end"
            className="w-[--radix-dropdown-menu-trigger-width]"
          >
            <DropdownMenuItem asChild>
              <SignOut text="Logout" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
