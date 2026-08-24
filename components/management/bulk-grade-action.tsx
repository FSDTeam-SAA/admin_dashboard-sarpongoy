"use client";

import { Loader2 } from "lucide-react";
import { GRADE_LEVELS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BulkGradeActionProps {
  selectedCount: number;
  itemLabel: string;
  gradeLevel: string;
  onGradeLevelChange: (value: string) => void;
  onApply: () => void;
  onClear: () => void;
  isPending?: boolean;
}

export function BulkGradeAction({
  selectedCount,
  itemLabel,
  gradeLevel,
  onGradeLevelChange,
  onApply,
  onClear,
  isPending = false,
}: BulkGradeActionProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-xl border border-[#b9ddbd] bg-[#f0fbf2] p-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold text-[#176b2d]">
          {selectedCount} {itemLabel}
          {selectedCount === 1 ? "" : "s"} selected
        </p>
        <p className="text-xs text-[#64806b]">
          Change the grade level for all selected records.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Select value={gradeLevel} onValueChange={onGradeLevelChange}>
          <SelectTrigger className="h-10 min-w-44 bg-white">
            <SelectValue placeholder="Select grade level" />
          </SelectTrigger>
          <SelectContent>
            {GRADE_LEVELS.map((grade) => (
              <SelectItem key={grade} value={grade}>
                {grade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          size="sm"
          onClick={onApply}
          disabled={!gradeLevel || isPending}
          className="min-w-32"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update grade"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onClear}
          disabled={isPending}
        >
          Clear selection
        </Button>
      </div>
    </div>
  );
}
