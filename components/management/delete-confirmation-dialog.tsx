"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function DeleteConfirmationDialog({ open, entity, isPending, onCancel, onConfirm }: {
  open: boolean;
  entity: string;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen && !isPending) onCancel(); }}>
      <DialogContent className="max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="pr-8 text-2xl">Delete {entity}?</DialogTitle>
          <DialogDescription>Are you sure you want to delete this {entity}? This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={onCancel} disabled={isPending} autoFocus>No</Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
