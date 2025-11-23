"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { toast } from "sonner";

interface CreateClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // When a new class is created call this with the new class id (string)
  onSuccess: (newClassId: string) => void;
}

export function CreateClassDialog({ open, onOpenChange, onSuccess }: CreateClassDialogProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Class name is required");
      return;
    }
    setIsSubmitting(true);
    try {
      // Minimal stub: we don't call the backend here to avoid coupling; instead return
      // a temporary id that the parent can use. Replace this with a real mutation when
      // a vehicleClasses.create server function exists.
      const generatedId = `new-${Date.now()}`;
      onSuccess(generatedId);
      onOpenChange(false);
      setName("");
      toast.success("Class created (local). Replace with backend call to persist).");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create class");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Vehicle Class</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <FormLabel>Name</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateClassDialog;
