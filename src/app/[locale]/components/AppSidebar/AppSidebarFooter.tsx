import { SidebarFooter } from "@/components/ui/sidebar";
import { Suspense } from "react";

import { Locale } from "@/locale";

import { AppSidebarUserProfile } from "./AppSidebarUserProfile";
import { AppSidebarUserProfileSkeleton } from "./AppSidebarUserProfileSkeleton";

interface Props {
  locale: Locale;
}

export const AppSidebarFooter = ({ locale }: Props) => {
  return (
    <SidebarFooter>
      <Suspense fallback={<AppSidebarUserProfileSkeleton />}>
        <AppSidebarUserProfile locale={locale} />
      </Suspense>
    </SidebarFooter>
  );
};
