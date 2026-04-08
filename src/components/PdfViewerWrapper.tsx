"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// This wrapper allows us to use the client-only PdfViewer 
// safely inside Server Components by disabling SSR for this specific part.
const PdfViewer = dynamic(() => import("./PdfViewer"), { 
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-xl border border-dashed border-gray-200">
      <Loader2 className="w-10 h-10 text-allianz-blue animate-spin mb-4" />
      <p className="text-allianz-navy/60 font-medium">Initializing viewer...</p>
    </div>
  )
});

export default PdfViewer;
