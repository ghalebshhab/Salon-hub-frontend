import { CheckCircle2, XCircle, Info, AlertTriangle } from "lucide-react";

function AppToast({ type = "info", title, message }) {
  const icons = {
    success: <CheckCircle2 size={22} strokeWidth={1.7} />,
    error: <XCircle size={22} strokeWidth={1.7} />,
    warning: <AlertTriangle size={22} strokeWidth={1.7} />,
    info: <Info size={22} strokeWidth={1.7} />,
  };

  return (
    <div className={`salon-toast-card salon-toast-${type}`}>
      <div className="salon-toast-accent" />

      <div className="salon-toast-icon-box">{icons[type] || icons.info}</div>

      <div className="salon-toast-content">
        <h4>{title}</h4>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default AppToast;
