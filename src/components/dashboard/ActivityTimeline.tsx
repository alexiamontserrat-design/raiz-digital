import { Panel } from "@/components/ui/Panel";

interface TimelineItemProps {
  color: "green" | "sand";
  title: string;
  text: string;
  time: string;
}

function TimelineItem({ color, title, text, time }: TimelineItemProps) {
  return (
    <div className="timeline-item">
      <span className={`timeline-dot ${color}`} aria-hidden="true" />
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
        <small>{time}</small>
      </div>
    </div>
  );
}

export function ActivityTimeline() {
  return (
    <Panel
      id="actividades"
      title="Actividad reciente"
      subtitle="Lo último registrado en el sistema"
      linkLabel="Ver agenda"
      linkHref="/actividades"
    >
      <div className="timeline">
        <TimelineItem
          color="green"
          title="Tu espacio está listo"
          text="Conecta PostgreSQL para comenzar a operar."
          time="Ahora"
        />
        <TimelineItem
          color="sand"
          title="Base de datos pendiente"
          text="Los módulos aparecerán aquí conforme tengan actividad."
          time="Configuración inicial"
        />
      </div>
    </Panel>
  );
}
