"use client";

import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2, AlertCircle } from "lucide-react";

// Set worker path - using local worker for reliability
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null); // track active render task
  const [pdf, setPdf] = useState<any>(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadPdf = async () => {
      setLoading(true);
      setError(null);
      try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdfDoc = await loadingTask.promise;
        if (!cancelled) {
          setPdf(pdfDoc);
          setNumPages(pdfDoc.numPages);
          setPageNum(1);
          setLoading(false);
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error("Error loading PDF:", err);
          setError("Failed to load PDF. Please try again.");
          setLoading(false);
        }
      }
    };

    if (url) loadPdf();

    return () => {
      cancelled = true;
    };
  }, [url]);

  useEffect(() => {
    if (!pdf || !canvasRef.current) return;

    let cancelled = false;

    const renderPage = async () => {
      // Cancel any in-flight render before starting a new one
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (_) {}
        renderTaskRef.current = null;
      }

      try {
        const page = await pdf.getPage(pageNum);
        if (cancelled) return;

        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current!;
        const context = canvas.getContext("2d")!;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderTask = page.render({
          canvasContext: context,
          viewport,
        });

        renderTaskRef.current = renderTask;

        await renderTask.promise;
        renderTaskRef.current = null;
      } catch (err: any) {
        if (err?.name !== "RenderingCancelledException") {
          console.error("Error rendering page:", err);
        }
      }
    };

    renderPage();

    return () => {
      cancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (_) {}
        renderTaskRef.current = null;
      }
    };
  }, [pdf, pageNum, scale]);

  const changePage = (offset: number) => {
    setPageNum((prev) => Math.min(Math.max(1, prev + offset), numPages));
  };

  const zoom = (factor: number) => {
    setScale((prev) => Math.min(Math.max(0.5, prev * factor), 3));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <Loader2 className="w-10 h-10 text-allianz-blue animate-spin mb-4" />
        <p className="text-allianz-navy/60 font-medium">Preparing secure document view...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-red-50 rounded-xl border border-red-100 text-red-600 p-6 text-center">
        <AlertCircle className="w-12 h-12 mb-4" />
        <p className="font-bold text-lg">Unable to display PDF</p>
        <p className="text-sm opacity-80 mt-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          Try Reloading
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-gray-100 rounded-xl overflow-hidden shadow-inner border border-gray-200">
      {/* Toolbar */}
      <div className="w-full bg-allianz-blue text-white p-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => changePage(-1)}
              disabled={pageNum <= 1}
              className="p-1 hover:bg-allianz-medblue rounded disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium min-w-[3rem] text-center">
              {pageNum} / {numPages}
            </span>
            <button
              onClick={() => changePage(1)}
              disabled={pageNum >= numPages}
              className="p-1 hover:bg-allianz-medblue rounded disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="h-4 w-[1px] bg-white/20" />
          <div className="flex items-center gap-1">
            <button
              onClick={() => zoom(0.8)}
              className="p-1 hover:bg-allianz-medblue rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium w-12 text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => zoom(1.2)}
              className="p-1 hover:bg-allianz-medblue rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="hidden sm:block text-xs font-mono opacity-60">
          Powered by Allianz Secure View
        </div>
      </div>

      {/* Canvas Area */}
      <div className="w-full h-full p-6 overflow-auto flex justify-center bg-[#525659]">
        <div className="bg-white shadow-2xl">
          <canvas ref={canvasRef} className="max-w-full h-auto" />
        </div>
      </div>
    </div>
  );
}
