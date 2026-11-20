import { Activity, CalendarDays, Star } from "lucide-react";
import { initials } from "../model/dashboardModel.js";
import { getOwnerStatusLook, money } from "../model/dashboardFormat.js";

function CustomerCard({ customer }) {
  return (
    <article className="owner-customer-card">
      <div className="table-person">
        <span className="owner-avatar">{customer.initials}</span>
        <span>
          <strong>{customer.name}</strong>
          <small>{customer.email || customer.phone}</small>
        </span>
      </div>
      <span
        className={`owner-customer-type type-${customer.type.toLowerCase()}`}
      >
        {customer.type}
      </span>
      <dl>
        <div>
          <dt>Bookings</dt>
          <dd>{customer.bookings.length}</dd>
        </div>
        <div>
          <dt>Completed</dt>
          <dd>{customer.completed}</dd>
        </div>
        <div>
          <dt>Total spent</dt>
          <dd>{money(customer.spent)}</dd>
        </div>
        <div>
          <dt>Average value</dt>
          <dd>{money(customer.averageValue)}</dd>
        </div>
        <div>
          <dt>Favorite service</dt>
          <dd>{customer.favoriteService}</dd>
        </div>
        <div>
          <dt>Last employee</dt>
          <dd>{customer.preferredEmployee}</dd>
        </div>
      </dl>
    </article>
  );
}

function ReviewsPanel({ reviews }) {
  const average = reviews.length
    ? (
        reviews.reduce((total, review) => total + Number(review.rating), 0) /
        reviews.length
      ).toFixed(1)
    : "—";
  return (
    <article className="owner-panel">
      <div className="owner-panel-heading">
        <div>
          <span className="eyebrow">Customer voice</span>
          <h2>Latest verified reviews</h2>
        </div>
        <span className="owner-rating">
          <Star size={15} fill="currentColor" aria-hidden="true" />
          {average}
          <small>{reviews.length} reviews</small>
        </span>
      </div>
      {reviews.slice(0, 5).map((review) => (
        <div className="review-row" key={review.id}>
          <span className="owner-avatar" aria-hidden="true">
            {initials(review.customerName || "")}
          </span>
          <div>
            <div className="review-name">
              <strong>{review.customerName}</strong>
              <span
                className="review-stars"
                role="img"
                aria-label={`${review.rating} out of 5 stars`}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={12}
                    fill={
                      Number(review.rating) >= star ? "currentColor" : "none"
                    }
                  />
                ))}
              </span>
            </div>
            <p>
              {review.comment || "Rating submitted without a written comment."}
            </p>
            <small>
              {review.serviceNames?.join(", ") || "Completed booking"} ·{" "}
              {review.employeeName || "Employee unavailable"} ·{" "}
              {new Date(review.createdAt).toLocaleDateString("en-GB")}
            </small>
          </div>
        </div>
      ))}
      {!reviews.length && (
        <p className="owner-panel-empty">
          Verified completed-booking reviews will appear here.
        </p>
      )}
    </article>
  );
}

function ActivityPanel({ activity = [] }) {
  return (
    <article className="owner-panel">
      <div className="owner-panel-heading">
        <div>
          <span className="eyebrow">Latest activity</span>
          <h2>What happened recently</h2>
        </div>
        <Activity size={18} aria-hidden="true" />
      </div>
      {activity.length ? (
        <ol className="activity-list">
          {activity.map((event) => (
            <li className="activity-row" key={event.id}>
              <span className="activity-icon" aria-hidden="true">
                {event.type === "review" ? (
                  <Star size={15} />
                ) : (
                  <CalendarDays size={15} />
                )}
              </span>
              <div>
                <strong>{event.title}</strong>
                <p>{event.text}</p>
                <small>
                  <time dateTime={event.at}>
                    {new Date(event.at).toLocaleString("en-GB", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                  {event.status && (
                    <>
                      {" · "}
                      {getOwnerStatusLook(event.status).label}
                    </>
                  )}
                </small>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="owner-panel-empty">
          New booking requests and reviews show here.
        </p>
      )}
    </article>
  );
}

export default function CustomerInsights({ customers, reviews, activity }) {
  return (
    <>
      <section className="owner-panel owner-customers">
        <div className="owner-panel-heading">
          <div>
            <span className="eyebrow">Customer insights</span>
            <h2>Customers who booked your salon</h2>
            <p>
              Visit frequency, value, favorite services, and employee
              relationships.
            </p>
          </div>
          <span className="owner-rank">{customers.length} customers</span>
        </div>
        <div className="owner-customer-grid">
          {customers.slice(0, 8).map((customer) => (
            <CustomerCard customer={customer} key={customer.id} />
          ))}
        </div>
        {!customers.length && (
          <p className="owner-panel-empty">
            Customer insights appear after the salon receives bookings.
          </p>
        )}
      </section>
      <section className="owner-section-grid owner-bottom-grid">
        <ReviewsPanel reviews={reviews} />
        <ActivityPanel activity={activity} />
      </section>
    </>
  );
}
