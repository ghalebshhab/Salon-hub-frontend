import { ArrowLeft, ArrowRight, Send } from "lucide-react";
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
              <strong>{flow.totalPrice} JD</strong>
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
            step={step}
          />
        </aside>
      </div>
    </section>
  );
}

export default CreateBooking;
