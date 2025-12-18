import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";

import { getDictionary } from "@/dictionaries";
import { Locale } from "@/locale";
import { AppSidebarFooter } from "./AppSidebarFooter";

import LogoIcon from "../../logo.svg";

interface AppSidebarProps {
  locale: Locale;
}

export const AppSidebar = async ({ locale }: AppSidebarProps) => {
  const d = await getDictionary(locale, "appSidebar");

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center gap-2">
        <div className="rounded-lg bg-black p-2">
          <Image
            src={LogoIcon}
            alt="Skarb icon"
            width={38}
            height={38}
            className="rounded"
          />
        </div>
        <h2 className="text-lg font-bold">{d.appTitle}</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <AppSidebarFooter />
    </Sidebar>
  );
};
