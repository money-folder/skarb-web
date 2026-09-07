import { ChevronsUpDown, LogIn, LogOut } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

import { logout } from "@/app/[locale]/auth/actions";
import { AuthRefresher } from "@/app/[locale]/auth/components/AuthRefresher";
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
import { getDictionary } from "@/dictionaries";
import { REFRESH_TOKEN_COOKIE } from "@/lib/auth/consts";
import { Locale } from "@/locale";

interface Props {
  locale: Locale;
}

export const AppSidebarUserProfile = async ({ locale }: Props) => {
  const d = await getDictionary(locale, "sidebar");
  const session = await auth();
  const user = session?.user;

  if (!user) {
    const hasRefreshToken = (await cookies()).has(REFRESH_TOKEN_COOKIE);

    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton className="w-full" asChild>
            <Link
              href={`/${locale}/auth`}
              className="flex w-full items-center gap-2 text-sm"
            >
              <LogIn className="h-4 w-4" />
              {d.signinLabel}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {hasRefreshToken && <AuthRefresher />}
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-full py-5" tooltip={user.username}>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                <span className="text-xs font-medium">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col items-start overflow-hidden">
                <span className="truncate font-medium">{user.username}</span>
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
              <form action={logout} className="w-full">
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  {d.signoutLabel}
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
