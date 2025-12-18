import { SidebarFooter } from "@/components/ui/sidebar";
import { Suspense } from "react";

import { AppSidebarUserProfile } from "./AppSidebarUserProfile";
import { AppSidebarUserProfileSkeleton } from "./AppSidebarUserProfileSkeleton";

export const AppSidebarFooter = () => {
  return (
    <SidebarFooter>
      <Suspense fallback={<AppSidebarUserProfileSkeleton />}>
        <AppSidebarUserProfile />
      </Suspense>
    </SidebarFooter>
  );
};
