interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
  trendLabel: string;
}

export function StatCard({ label, value, icon, trendLabel }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-icon" aria-hidden="true">
        {icon}
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
      <span className="trend">{trendLabel}</span>
    </div>
  );
}

