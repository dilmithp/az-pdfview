interface DashboardHeaderProps {
  title: string;
  description?: string;
}

export default function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <div className="mb-8 border-b border-allianz-blue/10 pb-6">
      <h1 className="text-3xl font-bold text-allianz-blue">{title}</h1>
      {description && (
        <p className="text-allianz-navy/60 mt-1 max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}
