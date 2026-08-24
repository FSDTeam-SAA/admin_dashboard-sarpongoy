"use client";

import { type InputHTMLAttributes, useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

interface SelectionCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  indeterminate?: boolean;
}

export function SelectionCheckbox({
  indeterminate = false,
  className,
  ...props
}: SelectionCheckboxProps) {
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      ref={checkboxRef}
      type="checkbox"
      className={cn(
        "h-4 w-4 cursor-pointer rounded border-[#a9b8a2] accent-[#079938] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#079938] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
