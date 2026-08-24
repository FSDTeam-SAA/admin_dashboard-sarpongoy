"use client";

import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface ExportColumn<T extends object> {
  key: keyof T;
  label: string;
}

interface ExportRecordsDialogProps<T extends object> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  fileName: string;
  columns: readonly ExportColumn<T>[];
  rows: T[];
  isLoading?: boolean;
  errorMessage?: string;
}

const escapeCsvValue = (value: unknown) => {
  const rawValue = String(value ?? "");
  const safeValue = /^[=+\-@]/.test(rawValue) ? `'${rawValue}` : rawValue;
  return `"${safeValue.replace(/"/g, '""')}"`;
};

export function ExportRecordsDialog<T extends object>({
  open,
  onOpenChange,
  title,
  description,
  fileName,
  columns,
  rows,
  isLoading = false,
  errorMessage,
}: ExportRecordsDialogProps<T>) {
  const handleDownload = () => {
    if (rows.length === 0) return;

    const header = columns.map((column) => escapeCsvValue(column.label)).join(",");
    const body = rows
      .map((row) =>
        columns.map((column) => escapeCsvValue(row[column.key])).join(","),
      )
      .join("\r\n");
    const blob = new Blob(["\uFEFF", `${header}\r\n${body}`], {
      type: "text/csv;charset=utf-8",
    });
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1100px] overflow-hidden p-0">
        <DialogHeader className="mb-0 px-6 pb-4 pt-6">
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="max-h-[58vh] overflow-auto border-y border-[#e2e8dc]">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-[#f7faf4]">
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={String(column.key)} className="whitespace-nowrap">
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-40 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#079938]" />
                    <span className="mt-2 block text-sm text-[#6c756d]">
                      Loading all records...
                    </span>
                  </TableCell>
                </TableRow>
              ) : errorMessage ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-[#d73636]"
                  >
                    {errorMessage}
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-[#6c756d]"
                  >
                    No records available to export.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, rowIndex) => (
                  <TableRow key={`${String(row[columns[0].key])}-${rowIndex}`}>
                    {columns.map((column) => (
                      <TableCell
                        key={String(column.key)}
                        className="whitespace-nowrap"
                      >
                        {String(row[column.key] ?? "")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="m-0 items-center justify-between px-6 py-4 sm:justify-between">
          <p className="text-sm text-[#687069]">
            {isLoading ? "Loading records..." : `${rows.length} records`}
          </p>
          <Button
            type="button"
            onClick={handleDownload}
            disabled={isLoading || Boolean(errorMessage) || rows.length === 0}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download CSV
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
