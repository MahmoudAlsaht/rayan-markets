"use client";
import { FormEvent, useState, useTransition } from "react";
import DragAndDrop from "@/components/DragAndDrop";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function DataForm() {
  const [file, setFile] = useState<File>();

  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const formData = new FormData();
      formData.append("file", file as File);
      try {
        const response = await fetch("/upload-data-via-sheets/api", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
      } catch (error) {
        console.error("Upload failed:", error);
      }
    });
  };

  return !pending ? (
    <form onSubmit={handleSubmit}>
      <div className="space-y-2">
        <DragAndDrop file={file as File} setFile={setFile} />
      </div>
      <div className="mt-4">
        <Button className="w-full">Upload</Button>
      </div>
    </form>
  ) : (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-200">
      <Loader2 className="size-24 animate-spin text-rayanPrimary-dark" />
    </div>
  );
}
