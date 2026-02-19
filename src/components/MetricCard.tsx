const colorMap: Record<string, string> = {
  primary: "border-primary",
  success: "border-success",
  warning: "border-warning",
  info: "border-info",
  danger: "border-danger",
}

export default function MetricCard({
  title,
  value,
  color = "primary"
}: { title: string; value: string | number; color?: keyof typeof colorMap }) {
  const borderClass = "border-start border-4 " + (colorMap[color] ?? colorMap.primary)
  return (
    <div className={`card shadow-sm ${borderClass}`}>
      <div className="card-body">
        <div className="text-muted small text-uppercase">{title}</div>
        <div className="display-6 fw-bold">{value}</div>
      </div>
    </div>
  )
}
