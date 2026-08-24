"use client";

import { Download, Filter, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

interface ManagementToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onOpenFilter?: () => void;
  filterOpen?: boolean;
  filterCount?: number;
  onOpenCreate?: () => void;
  onOpenBulkCreate?: () => void;
  onOpenExport?: () => void;
  addLabel?: string;
  bulkAddLabel?: string;
  exportLabel?: string;
  className?: string;
}

export function ManagementToolbar({
  search,
  onSearchChange,
  onOpenFilter,
  filterOpen = false,
  filterCount = 0,
  onOpenCreate,
  onOpenBulkCreate,
  onOpenExport,
  addLabel = "Add New",
  bulkAddLabel = "Bulk Add",
  exportLabel = "Export",
  className,
}: ManagementToolbarProps) {
  return (
    <div className={cn("flex flex-col gap-3 md:flex-row", className)}>
      <div className="flex flex-1">
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search"
          className="h-12 rounded-r-none border-r-0 border-[#b7b7b7] text-base"
        />
        <Button
          size="icon"
          className="h-12 w-12 rounded-l-none rounded-r-lg"
          type="button"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
      {onOpenFilter ? (
        <div className="relative">
          <Button
            type="button"
            variant="secondary"
            onClick={onOpenFilter}
            aria-expanded={filterOpen}
            aria-label={filterOpen ? "Close filters" : "Open filters"}
            className={cn(
              "h-12 w-full px-0 md:w-12",
              filterOpen && "border-[#079938] bg-[#eaf9ee]",
            )}
          >
            <Filter className="h-5 w-5" />
          </Button>
          {filterCount > 0 ? (
            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#079938] px-1 text-[11px] font-semibold text-white">
              {filterCount}
            </span>
          ) : null}
        </div>
      ) : null}
      {onOpenCreate ? (
        <Button type="button" onClick={onOpenCreate} className="h-12 gap-2 text-[20px]">
          <Plus className="h-4 w-4" />
          {addLabel}
        </Button>
      ) : null}
      {onOpenBulkCreate ? (
        <Button
          type="button"
          variant="secondary"
          onClick={onOpenBulkCreate}
          className="h-12 gap-2 text-[20px]"
        >
          <Plus className="h-4 w-4" />
          {bulkAddLabel}
        </Button>
      ) : null}
      {onOpenExport ? (
        <Button
          type="button"
          variant="secondary"
          onClick={onOpenExport}
          aria-label={exportLabel}
          title={exportLabel}
          className="h-12 w-full px-0 md:w-12"
        >
          <Download className="h-5 w-5" />
        </Button>
      ) : null}
    </div>
  );
}
