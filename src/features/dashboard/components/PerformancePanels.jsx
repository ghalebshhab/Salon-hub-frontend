import { money } from "../model/dashboardFormat.js";

/** Bars get too thin for value labels above this count. */
const DENSE_BARS = 14;

const formatValue = (mode, value) =>
  mode === "revenue" ? money(value) : String(value);

function Chart({ data, mode, range }) {
  const max = Math.max(1, ...data.map((item) => Number(item[mode] || 0)));
  const dense = data.length > DENSE_BARS;
  const total = data.reduce((sum, item) => sum + Number(item[mode] || 0), 0);
  const best = data.reduce(
    (top, item) => (Number(item[mode]) > Number(top?.[mode] || 0) ? item : top),
    null,
  );
  const summary = `${mode === "revenue" ? "Revenue" : "Bookings"}, ${range.toLowerCase()}: total ${formatValue(mode, total)}${
    best
      ? `, highest on ${best.fullLabel} with ${formatValue(mode, best[mode])}`
      : ""
  }.`;

  return (
    <figure className="owner-chart-figure">
      <div
        className={`owner-chart ${dense ? "is-dense" : ""}`}
        role="img"
        aria-label={summary}
      >
        <div className="chart-y" aria-hidden="true">
          <span>{formatValue(mode, max)}</span>
          <span>
            {mode === "revenue" ? money(max / 2) : Math.ceil(max / 2)}
          </span>
          <span>0</span>
        </div>
        <div className="chart-bars" aria-hidden="true">
          {data.map((item, index) => (
            <div
              className="chart-column"
              key={item.key}
              title={`${item.fullLabel}: ${formatValue(mode, item[mode])}`}
            >
              {!dense && (
                <span className="chart-value">
                  {formatValue(mode, item[mode])}
                </span>
              )}
              <div className="chart-bar-wrap">
                <div
                  className={`chart-bar ${mode} ${item[mode] ? "" : "is-empty"}`}
                  style={{
                    height: `${item[mode] ? Math.max(4, (item[mode] / max) * 100) : 2}%`,
                  }}
                />
              </div>
              <small className={dense && index % 5 ? "is-hidden" : ""}>
                {item.label}
              </small>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

export default function PerformancePanels({
  data,
  range,
  chartMode,
  onChartModeChange,
}) {
  const modes = [
    ["revenue", "Revenue"],
    ["bookings", "Bookings"],
  ];
  const hasData = data.dayData.some((item) => item.bookings > 0);

  return (
    <section className="owner-section-grid">
      <article className="owner-panel owner-analytics">
        <div className="owner-panel-heading">
          <div>
            <span className="eyebrow">Performance</span>
            <h2>Revenue & bookings</h2>
            <p>
              {range === "Today"
                ? "Today, hour by hour."
                : `${range}, day by day.`}
            </p>
          </div>
          <div className="owner-toggle" role="group" aria-label="Chart data">
            {modes.map(([key, label]) => (
              <button
                key={key}
                className={chartMode === key ? "active" : ""}
                type="button"
                aria-pressed={chartMode === key}
                onClick={() => onChartModeChange(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {hasData ? (
          <Chart data={data.dayData} mode={chartMode} range={range} />
        ) : (
          <p className="owner-panel-empty owner-chart-empty">
            No bookings in this period yet. Pick a longer date range to see
            more.
          </p>
        )}
        <div className="chart-legend">
          <span>
            <i className={`legend-dot ${chartMode}`} aria-hidden="true" />
            {chartMode === "revenue"
              ? "Revenue from completed visits"
              : "All booking requests"}
          </span>
          <strong>
            {chartMode === "revenue"
              ? money(data.summary.revenue)
              : `${data.bookings.length} bookings`}
          </strong>
        </div>
      </article>
      <article className="owner-panel owner-breakdown">
        <div className="owner-panel-heading">
          <div>
            <span className="eyebrow">Revenue mix</span>
            <h2>Top services</h2>
            <p>Which services bring the most money.</p>
          </div>
        </div>
        {data.services.some((service) => service.completed > 0) ? (
          <ul className="service-list">
            {data.services.slice(0, 6).map((service) => (
              <li className="service-row" key={service.id}>
                <div className="service-row-top">
                  <strong>{service.name}</strong>
                  <span>{money(service.revenue)}</span>
                </div>
                <div
                  className="service-meter"
                  role="meter"
                  aria-label={`${service.name} share of revenue`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={service.share}
                >
                  <span style={{ width: `${service.share}%` }} />
                </div>
                <small>
                  {service.completed} completed · {service.share}% of revenue
                </small>
              </li>
            ))}
          </ul>
        ) : (
          <p className="owner-panel-empty">
            Your top services show here after visits are completed.
          </p>
        )}
      </article>
    </section>
  );
}
