import { prisma } from "@/lib/prisma";
import PdfViewer from "@/components/PdfViewerWrapper";
import DashboardHeader from "@/components/DashboardHeader";
import { formatFileSize, formatDate } from "@/lib/utils";
import { Download, ExternalLink, Calendar, FileType, HardDrive, Share2 } from "lucide-react";
import CopyLinkButton from "@/components/CopyLinkButton";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const pdf = await prisma.pdfFile.findUnique({ where: { id } });
  
  if (!pdf) return { title: "PDF Not Found | Allianz" };
  
  return {
    title: `${pdf.title} | Allianz Secure View`,
    description: `Securely view "${pdf.filename}" on Allianz PDF Share.`,
  };
}

export default async function ViewPdfPage({ params }: PageProps) {
  const { id } = await params;
  
  const pdf = await prisma.pdfFile.findUnique({
    where: { id },
  });

  if (!pdf) {
    notFound();
  }

  // Use a server-side proxy so the browser never directly hits Cloudinary CDN
  // (Cloudinary returns 401 to browser requests on this account's security settings)
  const proxyUrl = `/api/pdf-proxy/${id}`;

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-allianz-teal font-bold text-xs uppercase tracking-widest mb-2">
            <Share2 className="w-3" />
            <span>Public Secure Share</span>
          </div>
          <h1 className="text-3xl font-black text-allianz-blue leading-tight">
            {pdf.title}
          </h1>
          <p className="text-allianz-navy/40 text-sm mt-1">{pdf.filename}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <CopyLinkButton id={pdf.id} />
          <a
            href={pdf.url}
            download={pdf.filename}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-allianz-blue hover:bg-gray-50 rounded-lg text-sm font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </a>
          <a
            href={pdf.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-allianz-blue text-white hover:bg-allianz-medblue rounded-lg text-sm font-bold transition-all shadow-md"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open in New Tab</span>
          </a>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* PDF Viewer - Takes most space */}
        <div className="lg:col-span-3">
          <PdfViewer url={proxyUrl} />
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-allianz-blue/5 shadow-sm">
            <h3 className="text-allianz-blue font-bold mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
              <HardDrive className="w-4 h-4 text-allianz-teal" />
              Document Info
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-allianz-navy/30 mt-0.5" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-allianz-navy/30 tracking-wider">Uploaded On</p>
                  <p className="text-sm font-semibold text-allianz-navy">{formatDate(pdf.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <HardDrive className="w-4 h-4 text-allianz-navy/30 mt-0.5" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-allianz-navy/30 tracking-wider">File Size</p>
                  <p className="text-sm font-semibold text-allianz-navy">{formatFileSize(pdf.size)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileType className="w-4 h-4 text-allianz-navy/30 mt-0.5" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-allianz-navy/30 tracking-wider">Format</p>
                  <p className="text-sm font-semibold text-allianz-navy">PDF Document</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-allianz-teal/5 p-6 rounded-2xl border border-allianz-teal/10">
            <h4 className="text-allianz-blue font-bold text-sm mb-2">Secure Link</h4>
            <p className="text-xs text-allianz-navy/60 leading-relaxed mb-4">
              This link is generated securely. Only individuals with this URL can view the document.
            </p>
            <div className="p-3 bg-white/50 rounded-lg border border-allianz-white border-dashed text-[10px] font-mono text-allianz-navy/40 break-all">
              {id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
