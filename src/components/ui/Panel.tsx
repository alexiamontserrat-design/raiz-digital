import type { ReactNode } from "react";

interface PanelHeadingProps {
  title: string;
  subtitle: string;
  linkLabel: string;
  linkHref?: string;
}

export function PanelHeading({
  title,
  subtitle,
  linkLabel,
  linkHref = "#",
}: PanelHeadingProps) {
  return (
    <div className="panel-heading">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <a href={linkHref}>
        {linkLabel} <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}

interface PanelProps extends PanelHeadingProps {
  id?: string;
  children: ReactNode;
}

export function Panel({
  id,
  title,
  subtitle,
  linkLabel,
  linkHref,
  children,
}: PanelProps) {
  return (
    <div className="panel" id={id}>
      <PanelHeading
        title={title}
        subtitle={subtitle}
        linkLabel={linkLabel}
        linkHref={linkHref}
      />
      {children}
    </div>
  );
}

