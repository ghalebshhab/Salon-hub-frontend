import { ArrowDownRight, ArrowUpRight, CalendarDays, Clock3, DollarSign, Star, TrendingUp, UserRound, UsersRound, X } from "lucide-react";
import { money } from "../model/dashboardFormat.js";

const icons = { revenue: DollarSign, bookings: CalendarDays, pending: Clock3, employees: UsersRound, customers: UserRound, rating: Star, cancellation: X, average: TrendingUp };

function StatCard({ type, label, value, change, detail }) {
  const Icon = icons[type];
  const positive = Number(change) >= 0;
  return (
    <article className="owner-stat-card">
      <div className="owner-stat-top"><span className="owner-stat-icon"><Icon size={18} /></span><button className="owner-info" type="button" title={detail} aria-label={`How ${label.toLowerCase()} is calculated`}>i</button></div>
      <p>{label}</p><strong>{value}</strong>
      <div className="owner-stat-foot">
        {change !== null && <span className={positive ? "trend-up" : "trend-down"}>{positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{Math.abs(change)}%</span>}
        <small>{detail}</small>
      </div>
    </article>
  );
}

export default function DashboardStats({ summary }) {
  const stats = [
    ["revenue", "Total revenue", money(summary.revenue), summary.revenueChange, "Completed bookings only"],
    ["bookings", "Completed bookings", summary.completed, summary.completedChange, "Compared with the previous period"],
    ["pending", "Pending requests", summary.pending, null, "Need your attention"],
    ["employees", "Active employees", summary.employees, null, "Currently active team members"],
    ["customers", "Unique customers", summary.customers, null, "Customers in this period"],
    ["rating", "Average salon rating", summary.rating ? summary.rating.toFixed(1) : "—", null, `${summary.ratingCount} verified ratings`],
    ["cancellation", "Cancellation rate", `${summary.cancellation}%`, null, "Lower is better"],
    ["average", "Average booking value", money(summary.averageValue), null, "Completed bookings"],
  ];
  return <section className="owner-stats-grid">{stats.map(([type, label, value, change, detail]) => <StatCard type={type} label={label} value={value} change={change} detail={detail} key={type} />)}</section>;
}



