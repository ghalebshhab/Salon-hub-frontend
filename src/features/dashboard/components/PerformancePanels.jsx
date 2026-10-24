import { Download } from "lucide-react";
import { money } from "../model/dashboardFormat.js";

function Chart({ data, mode, range }) {
  const max = Math.max(1, ...data.map((item) => Number(item[mode] || 0)));
  return (
    <div className="owner-chart" aria-label={`${mode} over ${range.toLowerCase()}`}>
      <div className="chart-y"><span>{mode === "revenue" ? money(max) : max}</span><span>{mode === "revenue" ? money(max / 2) : Math.ceil(max / 2)}</span><span>0</span></div>
      <div className="chart-bars">{data.map((item) => <div className="chart-column" key={item.label}><span className="chart-value">{mode === "revenue" ? money(item[mode]) : item[mode]}</span><div className="chart-bar-wrap"><div className={`chart-bar ${mode}`} style={{ height: `${Math.max(6, (item[mode] / max) * 100)}%` }} /></div><small>{item.label}</small></div>)}</div>
    </div>
  );
}

export default function PerformancePanels({ data, range, chartMode, onChartModeChange }) {
  return (
    <section className="owner-section-grid">
      <article className="owner-panel owner-analytics">
        <div className="owner-panel-heading"><div><span className="eyebrow">Performance pulse</span><h2>Revenue & bookings</h2><p>Completed revenue compared with appointment volume.</p></div><div className="owner-toggle"><button className={chartMode === "revenue" ? "active" : ""} type="button" onClick={() => onChartModeChange("revenue")}>Revenue</button><button className={chartMode === "bookings" ? "active" : ""} type="button" onClick={() => onChartModeChange("bookings")}>Bookings</button></div></div>
        <Chart data={data.dayData} mode={chartMode} range={range} />
        <div className="chart-legend"><span><i className="legend-plum" />{chartMode === "revenue" ? "Completed revenue" : "All booking requests"}</span><strong>{chartMode === "revenue" ? money(data.summary.revenue) : `${data.bookings.length} bookings`}</strong></div>
      </article>
      <article className="owner-panel owner-breakdown">
        <div className="owner-panel-heading"><div><span className="eyebrow">Revenue mix</span><h2>Services</h2><p>What keeps the chairs busy.</p></div><button className="owner-icon-button" type="button" aria-label="Service performance information"><Download size={15} /></button></div>
        {data.services.length ? data.services.slice(0, 6).map((service) => <div className="service-row" key={service.id}><div className="service-row-top"><strong>{service.name}</strong><span>{money(service.revenue)}</span></div><div className="service-meter"><span style={{ width: `${service.share}%` }} /></div><small>{service.completed} completed · {service.share}% of completed service revenue</small></div>) : <p className="owner-panel-empty">Service performance appears after bookings are completed.</p>}
      </article>
    </section>
  );
}

