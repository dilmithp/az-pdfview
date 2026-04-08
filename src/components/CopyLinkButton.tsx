"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

interface CopyLinkButtonProps {
  id: string;
}

export default function CopyLinkButton({ id }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    const url = `${window.location.origin}/view/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <button
      onClick={copyToClipboard}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
        copied
          ? "bg-green-100 text-green-700"
          : "bg-allianz-teal text-white hover:bg-allianz-medblue"
      }`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span>Copy Link</span>
        </>
      )}
    </button>
  );
}
