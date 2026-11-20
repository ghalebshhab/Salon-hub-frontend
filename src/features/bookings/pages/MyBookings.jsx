import { useCallback, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CalendarCheck2,
  CalendarPlus,
  CalendarX2,
  History,
} from "lucide-react";
import useMyBookings from "../hooks/useMyBookings.js";
import useHighlightedBooking from "../hooks/useHighlightedBooking.js";
import { isLiveToday } from "../model/booking.js";
import {
  BOOKING_VIEWS,
  countByView,
  countNeedsAnswer,
  getBookingView,
  selectBookings,
} from "../model/customerBookings.js";
import BookingViewTabs from "../components/customer/BookingViewTabs.jsx";
import CustomerBookingCard from "../components/customer/CustomerBookingCard.jsx";
import MyBookingsSkeleton from "../components/customer/MyBookingsSkeleton.jsx";
import ReceiptDialog from "../../payments/components/ReceiptDialog.jsx";
import CreateReviewModal from "../../reviews/components/CreateReviewModal.jsx";

const EMPTY_STATES = {
  upcoming: {
    Icon: CalendarCheck2,
    title: "No upcoming appointments",
    text: "Find a salon you like and book your next visit in a few taps.",
  },
  past: {
    Icon: History,
    title: "No past visits yet",
    text: "After your first appointment, you can review it and book it again from here.",
  },
  closed: {
    Icon: CalendarX2,
    title: "Nothing cancelled",
    text: "Cancelled, declined and expired requests appear here.",
  },
};

const VIEW_KEYS = new Set(BOOKING_VIEWS.map((view) => view.key));

function MyBookings() {
  const {
    bookings,
    loading,
    handleCancel,
    handleConfirmAttendance,
    confirmingId,
    handleRescheduleDecision,
    respondingProposalId,
    reviewModalOpen,
    selectedReviewBooking,
    openReviewModal,
    closeReviewModal,
    handleReviewCreated,
    canCancel,
  } = useMyBookings();
  const highlightedId = useHighlightedBooking(!loading);
  const [params, setParams] = useSearchParams();
  const [receiptBookingId, setReceiptBookingId] = useState(null);
  const closeReceipt = useCallback(() => setReceiptBookingId(null), []);

  // A link to one booking opens the list that holds it.
  const highlighted = bookings.find((item) => item.id === highlightedId);
  const requestedView = params.get("view");
  const view = VIEW_KEYS.has(requestedView)
    ? requestedView
    : highlighted
      ? getBookingView(highlighted)
      : "upcoming";

  const changeView = (next) =>
    setParams(
      (current) => {
        const updated = new URLSearchParams(current);
        updated.set("view", next);
        updated.delete("bookingId");
        return updated;
      },
      { replace: true },
    );

  const counts = useMemo(() => countByView(bookings), [bookings]);
  const visible = useMemo(
    () => selectBookings(bookings, view),
    [bookings, view],
  );
  const needsAnswer = countNeedsAnswer(bookings);
  const empty = EMPTY_STATES[view];

  return (
    <section className="container section mb-page">
      <header className="mb-hero">
        <div>
          <span className="eyebrow">My appointments</span>
          <h1>My bookings</h1>
          <p>
            {loading
              ? "Loading your appointments…"
              : counts.upcoming > 0
                ? `You have ${counts.upcoming} upcoming ${counts.upcoming === 1 ? "appointment" : "appointments"}.`
                : "Your requests, visits and receipts in one place."}
          </p>
        </div>
        <Link className="btn btn-primary" to="/">
          <CalendarPlus size={18} aria-hidden="true" />
          Book a new visit
        </Link>
      </header>

      {needsAnswer > 0 && (
        <p className="mb-alert" role="status">
          <strong>{needsAnswer}</strong>{" "}
          {needsAnswer === 1 ? "salon proposed" : "salons proposed"} a new time.
          Please accept it or keep your time.
        </p>
      )}

      <BookingViewTabs value={view} counts={counts} onChange={changeView} />

      <div id="mb-panel" role="tabpanel" aria-labelledby={`mb-tab-${view}`}>
        {loading && bookings.length === 0 ? (
          <MyBookingsSkeleton />
        ) : visible.length === 0 ? (
          <div className="mb-empty">
            <span className="mb-empty-icon" aria-hidden="true">
              <empty.Icon size={28} />
            </span>
            <h2>{empty.title}</h2>
            <p>{empty.text}</p>
            {view !== "closed" && (
              <Link className="btn btn-secondary btn-small" to="/">
                Explore salons
              </Link>
            )}
          </div>
        ) : (
          <div className="mb-list">
            {visible.map((booking) => (
              <CustomerBookingCard
                key={booking.id}
                booking={booking}
                live={isLiveToday(booking)}
                highlighted={highlightedId === booking.id}
                cancellable={canCancel(booking)}
                pendingProposal={booking.rescheduleProposals?.find(
                  (proposal) => proposal.status === "PENDING",
                )}
                respondingProposalId={respondingProposalId}
                onCancel={handleCancel}
                confirming={confirmingId === booking.id}
                onConfirmAttendance={handleConfirmAttendance}
                onReview={openReviewModal}
                onReceipt={() => setReceiptBookingId(booking.id)}
                onRescheduleDecision={handleRescheduleDecision}
              />
            ))}
          </div>
        )}
      </div>

      {reviewModalOpen && (
        <CreateReviewModal
          booking={selectedReviewBooking}
          onClose={closeReviewModal}
          onReviewCreated={handleReviewCreated}
        />
      )}
      <ReceiptDialog bookingId={receiptBookingId} onClose={closeReceipt} />
    </section>
  );
}

export default MyBookings;
