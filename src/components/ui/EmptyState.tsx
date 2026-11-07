interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-illustration" aria-hidden="true">
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel ? (
        <button type="button" className="secondary-button">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

