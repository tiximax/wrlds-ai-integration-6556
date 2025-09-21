import * as React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export const Spinner = ({ className }: { className?: string }) => (
  <svg className={cn("animate-spin text-primary", className)} viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
  </svg>
);

export const ProductCardSkeleton = () => (
  <div className="rounded-lg border shadow-sm p-0">
    <Skeleton className="h-48 w-full rounded-t-lg" />
    <div className="p-4 space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-3/4" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-10" />
      </div>
      <div className="flex items-center justify-between mt-3">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  </div>
);

export const EmptyState = ({
  title = "Không có dữ liệu",
  description = "Hãy thử lại với bộ lọc khác hoặc làm mới trang.",
  action,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) => (
  <div className="text-center py-16">
    <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M10 8h4"/><path d="M8 12h8"/><path d="M9 16h6"/></svg>
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground mb-4">{description}</p>
    {action}
  </div>
);
