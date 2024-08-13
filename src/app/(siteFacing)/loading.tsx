import React from "react";
import { Loader2 } from "lucide-react";

export default function SiteFacingLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="size-24 animate-spin bg-inherit text-rayanPrimary-dark" />
    </div>
  );
}
