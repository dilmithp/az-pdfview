import Link from "next/link";
import { FileText } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-allianz-blue text-white shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <FileText className="w-6 h-6 text-allianz-teal" />
          <span> Allianz | <span className="text-allianz-teal">PDF Share</span></span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-allianz-teal transition-colors">Home</Link>
          <Link href="/dashboard" className="text-sm font-medium hover:text-allianz-teal transition-colors">Dashboard</Link>
        </div>
      </div>
    </nav>
  );
}
