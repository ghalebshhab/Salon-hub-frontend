import { Activity, CalendarDays, Check, Star, UserRound } from "lucide-react";
import { money } from "../model/dashboardFormat.js";

function CustomerCard({ customer }) {
  return (
    <article className="owner-customer-card">
      <div className="table-person">
        <span className="owner-avatar">{customer.initials}</span>
        <span><strong>{customer.name}</strong><small>{customer.email || customer.phone}</small></span>
      </div>
      <span className={`owner-customer-type type-${customer.type.toLowerCase()}`}>{customer.type}</span>
      <dl>
        <div><dt>Bookings</dt><dd>{customer.bookings.length}</dd></div>
        <div><dt>Completed</dt><dd>{customer.completed}</dd></div>
        <div><dt>Total spent</dt><dd>{money(customer.spent)}</dd></div>
        <div><dt>Average value</dt><dd>{money(customer.averageValue)}</dd></div>
        <div><dt>Favorite service</dt><dd>{customer.favoriteService}</dd></div>
        <div><dt>Last employee</dt><dd>{customer.preferredEmployee}</dd></div>
      </dl>
    </article>
  );
}

function ReviewsPanel({ reviews }) {
  const average = reviews.length
    ? (reviews.reduce((total, review) => total + Number(review.rating), 0) / reviews.length).toFixed(1)
    : "—";
  return (
    <article className="owner-panel">
      <div className="owner-panel-heading">
        <div><span className="eyebrow">Customer voice</span><h2>Recent verified reviews</h2></div>
        <span className="owner-rating"><Star size={15} fill="currentColor" />{average}<small>{reviews.length} shown</small></span>
      </div>
      {reviews.slice(0, 5).map((review) => (
        <div className="review-row" key={review.id}>
          <span className="owner-avatar">{review.customerName?.split(" ").map((part) => part[0]).join("")}</span>
          <div>
            <div className="review-name">
              <strong>{review.customerName}</strong>
              <span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={12}
                    fill={Number(review.rating) >= star ? "currentColor" : "none"}
                  />
                ))}
              </span>
            </div>
            <p>{review.comment || "Rating submitted without a written comment."}</p>
            <small>{review.serviceNames?.join(", ") || "Completed booking"} · {review.employeeName || "Employee unavailable"} · {new Date(review.createdAt).toLocaleDateString()}</small>
          </div>
        </div>
      ))}
      {!reviews.length && <p className="owner-panel-empty">Verified completed-booking reviews will appear here.</p>}
    </article>
  );
}

function ActivityPanel({ customers, reviews }) {
  return (
    <article className="owner-panel">
      <div className="owner-panel-heading"><div><span className="eyebrow">Live feed</span><h2>Recent activity</h2></div><Activity size={18} /></div>
      <div className="activity-list">
        {reviews.slice(0, 2).map((review) => (
          <div className="activity-row" key={`review-${review.id}`}>
            <span className="activity-icon"><Star size={15} /></span>
            <div><strong>New {review.rating}-star rating</strong><p>{review.customerName} rated a completed booking{review.employeeName ? ` with ${review.employeeName}` : ""}.</p><small>{new Date(review.createdAt).toLocaleString()}</small></div>
          </div>
        ))}
        {customers.slice(0, 2).map((customer) => (
          <div className="activity-row" key={`customer-${customer.id}`}>
            <span className="activity-icon">{customer.completed ? <Check size={15} /> : <CalendarDays size={15} />}</span>
            <div><strong>{customer.type} customer activity</strong><p>{customer.name} has {customer.completed} completed salon bookings.</p><small>Based on live booking history</small></div>
          </div>
        ))}
        {!reviews.length && !customers.length && (
          <div className="activity-row"><span className="activity-icon"><UserRound size={15} /></span><div><strong>No recent activity</strong><p>Booking and rating events will appear here.</p></div></div>
        )}
      </div>
    </article>
  );
}

export default function CustomerInsights({ customers, reviews }) {
  return (
    <>
      <section className="owner-panel owner-customers">
        <div className="owner-panel-heading"><div><span className="eyebrow">Customer insights</span><h2>Customers who booked your salon</h2><p>Visit frequency, value, favorite services, and employee relationships.</p></div><span className="owner-rank">{customers.length} customers</span></div>
        <div className="owner-customer-grid">{customers.slice(0, 8).map((customer) => <CustomerCard customer={customer} key={customer.id} />)}</div>
        {!customers.length && <p className="owner-panel-empty">Customer insights appear after the salon receives bookings.</p>}
      </section>
      <section className="owner-section-grid owner-bottom-grid">
        <ReviewsPanel reviews={reviews} />
        <ActivityPanel customers={customers} reviews={reviews} />
      </section>
    </>
  );
}
