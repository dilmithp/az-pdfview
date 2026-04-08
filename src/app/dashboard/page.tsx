import DashboardHeader from "@/components/DashboardHeader";
import UploadPdfForm from "@/components/UploadPdfForm";
import PdfListTable from "@/components/PdfListTable";

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <DashboardHeader 
        title="PDF Management Dashboard" 
        description="Upload new PDF documents and manage your existing shared links from one central location."
      />
      
      <div className="grid lg:grid-cols-1 gap-8">
        <section>
          <h2 className="text-xl font-bold text-allianz-blue mb-4">Upload New Document</h2>
          <UploadPdfForm />
        </section>

        <section>
          <PdfListTable />
        </section>
      </div>
    </div>
  );
}
