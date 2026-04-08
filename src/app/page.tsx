import Link from "next/link";
import { FileText, Shield, Share2, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-allianz-blue text-white p-12 lg:p-24">
        {/* Subtle Geometric Pattern Overlay (Simulated with CSS) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--allianz-medblue)_0%,_transparent_50%)]" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-allianz-teal/20 text-allianz-teal rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            <Shield className="w-3.5 h-3.5" />
            <span>Secure Enterprise Document Sharing</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-8">
            Share Your PDFs <br />
            <span className="text-allianz-teal font-black">Securely & Professionally.</span>
          </h1>
          <p className="text-lg lg:text-xl opacity-80 mb-10 leading-relaxed font-light">
            Allianz PDF Share provides a premium experience for managing and sharing 
            internal documents. Upload, generate public links, and offer beautiful 
            inline previews to your stakeholders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/dashboard" 
              className="bg-white text-allianz-blue hover:bg-allianz-teal hover:text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-allianz-teal/20"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Hero Decorative Element */}
        <div className="absolute right-[-10%] bottom-[-20%] w-[500px] h-[500px] bg-allianz-medblue/20 rounded-full blur-[100px] pointer-events-none" />
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-allianz-blue mb-4">Streamlined Document Workflow</h2>
          <p className="text-allianz-navy/60 max-w-2xl mx-auto">
            Experience the efficiency of modern document management with our core enterprise features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <FileText className="w-8 h-8 text-allianz-blue" />,
              title: "Simple Upload",
              description: "Drag and drop your PDF documents into our secure portal. We handle the heavy lifting of storage and processing."
            },
            {
              icon: <Share2 className="w-8 h-8 text-allianz-teal" />,
              title: "One-Click Share",
              description: "Generate unique, professional links instantly. Share them via email, chat, or internal portals with ease."
            },
            {
              icon: <Eye className="w-8 h-8 text-allianz-medblue" />,
              title: "Premium Preview",
              description: "Recipients enjoy a beautiful inline PDF viewer without needing to download large files or use external apps."
            }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-allianz-blue/5 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold text-allianz-blue mb-3">{feature.title}</h3>
              <p className="text-allianz-navy/60 leading-relaxed text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Re-using Eye icon here for the map
function Eye(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
