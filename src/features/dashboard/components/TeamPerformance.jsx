import { ExternalLink, Sparkles } from "lucide-react";
import { money } from "../model/dashboardFormat.js";

const rating = (value) => (value ? value.toFixed(1) : "—");

export default function TeamPerformance({ employees, sort, onSortChange, onSelectEmployee }) {
  const sorted = [...employees].sort((a, b) => {
    if (sort === "Bookings") return b.bookings - a.bookings;
    if (sort === "Services") return b.services - a.services;
    if (sort === "Revenue") return b.revenue - a.revenue;
    if (sort === "Rating") return (b.rating || 0) - (a.rating || 0);
    return b.score - a.score;
  });
  const top = [...employees].sort((a, b) => b.score - a.score)[0];
  return (
    <section className="owner-section-grid owner-team-grid">
      <article className="owner-panel owner-top-performer">
        <div className="owner-panel-heading"><div><span className="eyebrow">Team spotlight</span><h2>Top performer</h2></div>{top && <span className="owner-rank">#1 this period</span>}</div>
        {top ? <><div className="performer-main"><span className="owner-avatar owner-avatar-lg">{top.initials}</span><div><h3>{top.name}</h3><p>{top.specialty}</p><span className="owner-score"><Sparkles size={15} />{top.score} performance score</span></div></div><div className="score-bars">{[["Completed bookings", top.bookings, Math.max(1, ...employees.map((item) => item.bookings))], ["Services completed", top.services, Math.max(1, ...employees.map((item) => item.services))], ["Customer rating", top.rating || 0, 5], ["Revenue generated", top.revenue, Math.max(1, ...employees.map((item) => item.revenue))]].map(([label, value, max]) => <div key={label}><div><span>{label}</span><b>{label === "Revenue generated" ? money(value) : label === "Customer rating" ? rating(value) : value}</b></div><div className="score-meter"><span style={{ width: `${(value / max) * 100}%` }} /></div></div>)}</div><button className="btn btn-secondary owner-full-button" type="button" onClick={() => onSelectEmployee(top)}>View employee details <ExternalLink size={15} /></button></> : <p className="owner-panel-empty">Active employees will appear here after joining the salon.</p>}
      </article>
      <article className="owner-panel owner-leaderboard">
        <div className="owner-panel-heading"><div><span className="eyebrow">Team health</span><h2>Leaderboard</h2><p>35% bookings · 25% services · 25% ratings · 15% revenue</p></div><select value={sort} onChange={(event) => onSortChange(event.target.value)} aria-label="Sort employees">{["Overall performance", "Bookings", "Services", "Rating", "Revenue"].map((item) => <option key={item}>{item}</option>)}</select></div>
        <div className="leaderboard-list">{sorted.map((employee, index) => <button className="leaderboard-row" type="button" key={employee.id} onClick={() => onSelectEmployee(employee)}><b className="leaderboard-rank">{index + 1}</b><span className="owner-avatar">{employee.initials}</span><span className="leaderboard-person"><strong>{employee.name}</strong><small>{employee.specialty}</small></span><span className="leaderboard-metric"><b>{employee.bookings}</b><small>bookings</small></span><span className="leaderboard-metric"><b>{rating(employee.rating)}</b><small>{employee.ratingCount} ratings</small></span><span className="owner-score-number">{employee.score}</span></button>)}</div>
      </article>
    </section>
  );
}

