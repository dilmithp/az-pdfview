export default function Footer() {
  return (
    <footer className="bg-allianz-blue text-white py-8 border-t border-allianz-medblue/20">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm opacity-80">
          © {new Date().getFullYear()} Allianz Insurance Lanka Ltd. All rights reserved.
        </p>
        <p className="text-xs mt-2 opacity-60">
          Professional PDF Management & Sharing Platform
        </p>
      </div>
    </footer>
  );
}
