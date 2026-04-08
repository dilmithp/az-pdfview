"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Eye, Loader2, Search } from "lucide-react";
import { formatFileSize, formatDate } from "@/lib/utils";
import CopyLinkButton from "./CopyLinkButton";

interface PdfFile {
  id: string;
  title: string;
  filename: string;
  size: number;
  createdAt: string;
}

export default function PdfListTable() {
  const [pdfs, setPdfs] = useState<PdfFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPdfs = async () => {
    try {
      const res = await fetch("/api/pdfs");
      const data = await res.json();
      if (Array.isArray(data)) setPdfs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  const filteredPdfs = pdfs.filter(pdf => 
    pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pdf.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-allianz-blue/5">
        <Loader2 className="w-8 h-8 text-allianz-blue animate-spin mb-4" />
        <p className="text-allianz-navy/60 font-medium">Retrieving your secure documents...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-allianz-blue/5 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
        <h2 className="font-bold text-allianz-blue">Your Uploaded PDFs</h2>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-allianz-medblue/20 transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-allianz-blue/5">
              <th className="px-6 py-4 text-xs font-bold text-allianz-navy uppercase tracking-wider">Document</th>
              <th className="px-6 py-4 text-xs font-bold text-allianz-navy uppercase tracking-wider">Size</th>
              <th className="px-6 py-4 text-xs font-bold text-allianz-navy uppercase tracking-wider">Upload Date</th>
              <th className="px-6 py-4 text-xs font-bold text-allianz-navy uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPdfs.length > 0 ? (
              filteredPdfs.map((pdf) => (
                <tr key={pdf.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-allianz-blue/10 rounded flex items-center justify-center text-allianz-blue group-hover:bg-allianz-blue group-hover:text-white transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-allianz-navy truncate max-w-[200px]">{pdf.title}</p>
                        <p className="text-xs text-allianz-navy/40 truncate max-w-[200px]">{pdf.filename}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-allianz-navy/60">
                    {formatFileSize(pdf.size)}
                  </td>
                  <td className="px-6 py-4 text-sm text-allianz-navy/60">
                    {formatDate(pdf.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <CopyLinkButton id={pdf.id} />
                      <Link
                        href={`/view/${pdf.id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-allianz-blue/5 text-allianz-blue hover:bg-allianz-blue hover:text-white rounded-lg text-sm font-medium transition-all"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Preview</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm text-allianz-navy/40 italic">
                  {searchTerm ? "No documents match your search" : "No documents uploaded yet"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
