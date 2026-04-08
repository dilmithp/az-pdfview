"use client";

import { useState, useCallback } from "react";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function UploadPdfForm() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const router = useRouter();

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      if (!title) setTitle(droppedFile.name.replace(/\.pdf$/i, ""));
    } else {
      toast.error("Please upload a valid PDF file");
    }
  }, [title]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      if (!title) setTitle(selectedFile.name.replace(/\.pdf$/i, ""));
    } else if (selectedFile) {
      toast.error("Please upload a valid PDF file");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const result = await response.json();
      toast.success("PDF uploaded successfully!");
      setFile(null);
      setTitle("");
      router.refresh();
      // Optionally redirect to the preview page
      // router.push(`/view/${result.id}`);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-allianz-blue/5 p-6 mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-allianz-navy mb-1">
            PDF Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a descriptive title"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-allianz-medblue/20 focus:border-allianz-medblue transition-all"
            required
            disabled={isUploading}
          />
        </div>

        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer",
            isDragActive 
              ? "border-allianz-teal bg-allianz-teal/5" 
              : "border-allianz-teal/30 hover:border-allianz-teal hover:bg-allianz-teal/2"
          )}
          onClick={() => !isUploading && document.getElementById("file-input")?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />

          {!file ? (
            <>
              <div className="w-12 h-12 bg-allianz-teal/10 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-allianz-teal" />
              </div>
              <p className="text-allianz-navy font-medium">Click or drag PDF here to upload</p>
              <p className="text-allianz-navy/40 text-sm mt-1">Accepts only .pdf files (Max 10MB)</p>
            </>
          ) : (
            <div className="flex items-center gap-4 bg-allianz-blue/5 p-4 rounded-lg w-full max-w-md">
              <div className="w-10 h-10 bg-allianz-blue/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-allianz-blue" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-allianz-navy font-medium truncate">{file.name}</p>
                <p className="text-allianz-navy/40 text-xs">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="p-1 hover:bg-red-50 text-red-500 rounded-md transition-colors"
                disabled={isUploading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!file || isUploading}
          className={cn(
            "w-full py-3 rounded-lg font-bold text-white transition-all transform active:scale-[0.98] flex items-center justify-center gap-2",
            !file || isUploading 
              ? "bg-gray-300 cursor-not-allowed" 
              : "bg-allianz-blue hover:bg-allianz-medblue shadow-md hover:shadow-lg"
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Uploading to Secure Storage...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Share Securely</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
