import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Phone,
  Send,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useCreateBooking, { BOOKING_STEPS } from "../hooks/useCreateBooking.js";
import BookingStepper from "../components/wizard/BookingStepper.jsx";
import ServiceStep from "../components/wizard/ServiceStep.jsx";
import ProfessionalStep from "../components/wizard/ProfessionalStep.jsx";
import TimeStep from "../components/wizard/TimeStep.jsx";
import ReviewStep from "../components/wizard/ReviewStep.jsx";
import BookingSummary from "../components/wizard/BookingSummary.jsx";
import BookingSent from "../components/wizard/BookingSent.jsx";
import { formatMoney, toFils } from "../../payments/model/payment.js";

/**
 * Shown when the salon's missed-visit rule limits this customer: either
 * "Card now" only, or no online booking with a way to contact the salon.
 */
function PaymentRestrictionNotice({ restriction, phone, salonPath }) {
  return (
    <div
      className={`bk-restriction ${restriction.blocked ? "is-blocked" : ""}`}
      role="status"
    >
      <AlertTriangle size={20} aria-hidden="true" />
      <div>
        <strong>
          {restriction.blocked
            ? "Online booking is not available for you here"
            : "This salon asks you to pay in advance"}
        </strong>
        <p>{restriction.message}</p>
        {restriction.blocked && (
          <div className="bk-restriction-actions">
            {phone && (
              <a className="btn btn-primary btn-small" href={`tel:${phone}`}>
                <Phone size={16} aria-hidden="true" /> Call {phone}
              </a>
            )}
            <Link className="btn btn-secondary btn-small" to={salonPath}>
              Back to the salon
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function CreateBooking() {
  const flow = useCreateBooking();
  const panelRef = useRef(null);
  const firstStepRef = useRef(true);
  const { step } = flow;

  // Move focus to the new step so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (firstStepRef.current) {
      firstStepRef.current = false;
      return;
    }
    panelRef.current?.focus({ preventScroll: true });
    panelRef.current?.scrollIntoView?.({
      block: "nearest",
      behavior: "smooth",
    });
  }, [step]);

  if (flow.loading) {
    return (
      <section
        className="container section bk-page"
        aria-label="Loading booking"
      >
        <div className="skeleton-block bk-skeleton-head" />
        <div className="skeleton-block bk-skeleton-body" />
      </section>
    );
  }

  if (!flow.salon) {
    return (
      <section className="container section">
        <div className="empty-state">
          <h3>Salon not found</h3>
          <p>Please go back and choose another salon.</p>
          <Link className="btn btn-primary" to="/">
            Browse salons
          </Link>
        </div>
      </section>
    );
  }

  if (flow.createdBooking) {
    return <BookingSent booking={flow.createdBooking} salon={flow.salon} />;
  }

  const isLast = step === BOOKING_STEPS.length - 1;
  const salonId = flow.salon.salonId ?? flow.salon.id;

  return (
    <section className="container section bk-page">
      <header className="bk-header">
        <Link className="bk-back" to={`/salons/${salonId}`}>
          <ArrowLeft size={16} aria-hidden="true" /> {flow.salon.name}
        </Link>
        <h1>Book an appointment</h1>
        <BookingStepper
          steps={BOOKING_STEPS}
          current={step}
          onSelect={flow.goToStep}
        />
      </header>

      {flow.paymentRestriction && (
        <PaymentRestrictionNotice
          restriction={flow.paymentRestriction}
          phone={flow.salon.phoneNumber}
          salonPath={`/salons/${salonId}`}
        />
      )}

      <div className={`bk-layout ${isLast ? "is-review" : ""}`}>
        <div
          className="bk-panel"
          ref={panelRef}
          tabIndex={-1}
          aria-live="polite"
        >
          {step === 0 && (
            <ServiceStep
              services={flow.services}
              selectedIds={flow.selectedServiceIds}
              onToggle={flow.toggleService}
            />
          )}
          {step === 1 && (
            <ProfessionalStep
              employees={flow.eligibleEmployees}
              selectedEmployeeId={flow.selectedEmployeeId}
              onChoose={flow.chooseEmployee}
            />
          )}
          {step === 2 && (
            <TimeStep
              salon={flow.salon}
              bookingDate={flow.bookingDate}
              onDateChange={flow.chooseDate}
              bookingTime={flow.bookingTime}
              onTimeChange={flow.setBookingTime}
              availability={flow.availability}
              slots={flow.availableSlots}
              loading={flow.availabilityLoading}
              error={flow.availabilityError}
              employee={flow.selectedEmployee}
              onSalonAssigns={flow.switchToSalonAssigns}
              onRetry={flow.reloadAvailability}
            />
          )}
          {step === 3 && (
            <ReviewStep
              phone={flow.customerPhoneNumber}
              onPhoneChange={flow.setCustomerPhoneNumber}
              area={flow.customerLocation}
              onAreaChange={flow.setCustomerLocation}
              note={flow.note}
              onNoteChange={flow.setNote}
              paymentMethods={flow.paymentMethods}
              paymentMethod={flow.paymentMethod}
              onPaymentMethodChange={flow.setPaymentMethod}
              totalPrice={flow.totalPrice}
              freeCancelHours={flow.freeCancelHours}
            />
          )}

          {flow.submitError && (
            <p className="bk-submit-error" role="alert">
              {flow.submitError}
            </p>
          )}

          <div className="bk-actions">
            {step > 0 && (
              <button
                className="btn btn-secondary"
                type="button"
                onClick={flow.goBack}
                disabled={flow.submitting}
              >
                <ArrowLeft size={17} aria-hidden="true" /> Back
              </button>
            )}
            <div className="bk-actions-total" aria-hidden="true">
              <span>{flow.selectedServices.length} service(s)</span>
              <strong>{formatMoney(toFils(flow.totalPrice))}</strong>
            </div>
            {isLast ? (
              <button
                className="btn btn-primary"
                type="button"
                onClick={flow.submit}
                disabled={flow.submitting || !flow.canContinue}
              >
                <Send size={17} aria-hidden="true" />
                {flow.submitting ? "Sending…" : "Send request"}
              </button>
            ) : (
              <button
                className="btn btn-primary"
                type="button"
                onClick={flow.goNext}
                disabled={!flow.canContinue}
              >
                Continue <ArrowRight size={17} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        <aside className="bk-aside" aria-label="Booking summary">
          <BookingSummary
            salon={flow.salon}
            services={flow.selectedServices}
            employee={flow.selectedEmployee}
            bookingDate={flow.bookingDate}
            bookingTime={flow.bookingTime}
            totalPrice={flow.totalPrice}
            totalDuration={flow.totalDuration}
            paymentMethod={flow.paymentMethod}
            step={step}
          />
        </aside>
      </div>
    </section>
  );
}

export default CreateBooking;
