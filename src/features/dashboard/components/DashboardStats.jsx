import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarCheck2,
  CalendarX2,
  Clock3,
  Star,
  TrendingUp,
  UserRound,
  UsersRound,
  Wallet,
  WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatMoney } from "../../payments/model/payment.js";
import { money } from "../model/dashboardFormat.js";
import t from "../../../shared/i18n/t.js";

/**
 * Change versus the previous period. `lowerIsBetter` flips the color, so a
 * falling no-show rate shows as good news.
 */
function Trend({ change, unit = "%", lowerIsBetter = false }) {
  if (change == null) return null;
  const value = Number(change);
  if (!value)
    return <span className="owner-trend is-flat">{t("No change")}</span>;
  const up = value > 0;
  const good = lowerIsBetter ? !up : up;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`owner-trend ${good ? "trend-up" : "trend-down"}`}>
      <Icon size={14} aria-hidden="true" />
      <span className="sr-only">{up ? t("Up") : t("Down")} </span>
      {Math.abs(value)}
      {unit}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, detail, trend }) {
  return (
    <article className="owner-stat-card">
      <span className="owner-stat-icon" aria-hidden="true">
        <Icon size={18} />
      </span>
      <p>{t(label)}</p>
      <strong>{value}</strong>
      <div className="owner-stat-foot">
        {trend}
        <small>{t(detail)}</small>
      </div>
    </article>
  );
}

function MiniStat({ icon: Icon, label, value, to }) {
  const body = (
    <>
      <Icon size={16} aria-hidden="true" />
      <span>{t(label)}</span>
      <strong>{value}</strong>
    </>
  );
  return to ? (
    <Link className="owner-mini-stat is-link" to={to}>
      {t(body)}
    </Link>
  ) : (
    <div className="owner-mini-stat">{t(body)}</div>
  );
}

/** Four main numbers first, then the smaller supporting numbers in one row. */
export default function DashboardStats({ summary, insights = null }) {
  const unpaid = insights?.payments;
  return (
    <section className="owner-stats" aria-label={t("Key numbers")}>
      <div className="owner-stats-grid">
        <StatCard
          icon={Wallet}
          label={t("Revenue")}
          value={money(summary.revenue)}
          detail={t("From completed visits, vs. previous period")}
          trend={<Trend change={summary.revenueChange} />}
        />
        <StatCard
          icon={CalendarCheck2}
          label={t("Completed visits")}
          value={summary.completed}
          detail={t("vs. previous period")}
          trend={<Trend change={summary.completedChange} />}
        />
        <StatCard
          icon={CalendarX2}
          label={t("Cancel & no-show rate")}
          value={`${summary.cancellation}%`}
          detail={
            insights
              ? t("No-show: {noShowRate}% of confirmed visits", {
                  noShowRate: insights.noShowRate,
                })
              : t("Of all bookings in this period")
          }
          trend={
            <Trend
              change={summary.cancellationChange}
              unit={` ${t("pts")}`}
              lowerIsBetter
            />
          }
        />
        <StatCard
          icon={Star}
          label={t("Salon rating")}
          value={summary.rating ? summary.rating.toFixed(1) : "—"}
          detail={t("{ratingCount} verified {value}", {
            ratingCount: summary.ratingCount,
            value: summary.ratingCount === 1 ? t("review") : t("reviews"),
          })}
        />
      </div>
      <div className="owner-mini-stats">
        <MiniStat
          icon={Clock3}
          label={t("Requests to answer")}
          value={summary.pending}
          to={summary.pending ? "/owner/bookings" : undefined}
        />
        {insights?.advanced ? (
          <MiniStat
            icon={UserRound}
            label={t("Returning ({returning} of {customers})", {
              returning: insights.returning,
              customers: summary.customers,
            })}
            value={`${insights.returningRate}%`}
          />
        ) : (
          <MiniStat
            icon={UserRound}
            label={t("Customers")}
            value={summary.customers}
          />
        )}
        <MiniStat
          icon={TrendingUp}
          label={t("Average visit value")}
          value={money(summary.averageValue)}
        />
        {unpaid ? (
          <MiniStat
            icon={WalletCards}
            label={t("Not paid yet ({unpaidCount})", {
              unpaidCount: unpaid.unpaidCount,
            })}
            value={formatMoney(unpaid.unpaidFils, insights.currency)}
            to={unpaid.unpaidCount ? "/owner/payments" : undefined}
          />
        ) : (
          <MiniStat
            icon={UsersRound}
            label={t("Active team")}
            value={summary.employees}
          />
        )}
      </div>
    </section>
  );
}
