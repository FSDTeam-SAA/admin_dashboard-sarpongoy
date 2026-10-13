"use client";

import { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { getApiErrorMessage, type BulkCreateResult } from "@/lib/api";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export type ErrorDetail = { label: string; message: string };
type ErrorReport = { message: string; details: ErrorDetail[] };
type ErrorFeedback = {
  showError: (error: unknown, details?: ErrorDetail[]) => void;
  showBulkErrors: (result: BulkCreateResult<unknown>, entity: string) => void;
};
const ErrorFeedbackContext = createContext<ErrorFeedback | null>(null);

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

function failureDetails(failures: unknown[]): ErrorDetail[] {
  return failures.map((failure, index) => {
    const entry = record(failure);
    const item = record(entry.item);
    const identity = [item.studentName || item.teacherName || item.name || item.schoolName, item.userId || item.schoolCode]
      .filter((value) => typeof value === "string" && value).join(" · ");
    const row = typeof entry.index === "number" ? entry.index + 1 : index + 1;
    return {
      label: `Data row ${row}${identity ? ` · ${identity}` : ""}`,
      message: typeof entry.message === "string" ? entry.message : "Unable to create this record",
    };
  });
}

export function ErrorFeedbackProvider({ children }: { children: React.ReactNode }) {
  const [report, setReport] = useState<ErrorReport | null>(null);

  const notify = (nextReport: ErrorReport) => {
    const open = () => setReport(nextReport);
    toast.error(
      <button type="button" onClick={open} className="w-full cursor-pointer text-left font-semibold" aria-label={`${nextReport.message}. View full error details`}>
        <span className="line-clamp-2">{nextReport.message}</span>
      </button>,
      {
        description: "Click to view full error details",
        action: { label: "View details", onClick: open },
        duration: 12000,
        closeButton: true,
      },
    );
  };

  const showError: ErrorFeedback["showError"] = (error, details) => {
    const message = typeof error === "string" ? error : getApiErrorMessage(error);
    const body = record(axios.isAxiosError(error) ? error.response?.data : error);
    const data = record(body.data);
    const failures = Array.isArray(data.failed) ? failureDetails(data.failed) : [];
    const sources = Array.isArray(body.errorSources) ? body.errorSources.map((source) => {
      const entry = record(source);
      return {
        label: typeof entry.path === "string" && entry.path ? entry.path : "Error",
        message: typeof entry.message === "string" ? entry.message : message,
      };
    }) : [];
    notify({ message, details: details || (failures.length ? failures : sources) });
  };

  return (
    <ErrorFeedbackContext.Provider value={{
      showError,
      showBulkErrors: (result, entity) => notify({
        message: `${result.created.length} ${entity} created, ${result.failed.length} failed`,
        details: failureDetails(result.failed),
      }),
    }}>
      {children}
      <Dialog open={report !== null} onOpenChange={(open) => { if (!open) setReport(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="pr-8 text-2xl">Error details</DialogTitle>
            <DialogDescription className="whitespace-pre-wrap break-words">{report?.message}</DialogDescription>
          </DialogHeader>
          {report?.details.length ? (
            <ul className="space-y-3">
              {report.details.map((detail, index) => (
                <li key={index} className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="break-words text-sm font-semibold">{detail.label}</p>
                  <p className="mt-1 whitespace-pre-wrap break-words text-sm text-red-800">{detail.message}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </DialogContent>
      </Dialog>
    </ErrorFeedbackContext.Provider>
  );
}

export function useErrorFeedback() {
  const context = useContext(ErrorFeedbackContext);
  if (!context) throw new Error("useErrorFeedback requires ErrorFeedbackProvider");
  return context;
}
