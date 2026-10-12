import useCreateBooking from "../hooks/useCreateBooking.js";

import {
  CalendarDays,
  Clock,
  MapPin,
  Phone,
  Scissors,
  StickyNote,
  UserRound,
} from "lucide-react";

function CreateBooking() {
  const {
    salon,
    services,
    employees,
    eligibleEmployees,
    selectedServiceIds,
    selectedEmployeeId,
    setSelectedEmployeeId,
    customerPhoneNumber,
    setCustomerPhoneNumber,
    customerLocation,
    setCustomerLocation,
    bookingDate,
    setBookingDate,
    bookingTime,
    setBookingTime,
    note,
    setNote,
    loading,
    submitting,
    selectedServices,
    totalPrice,
    totalDuration,
    handleServiceToggle,
    getTodayDate,
    getEarliestBookingTime,
    handleSubmit,
  } = useCreateBooking();

  if (loading) {
    return <div className="loading">Loading booking page...</div>;
  }

  if (!salon) {
    return (
      <section className="container section">
        <div className="empty-state">
          <h3>Salon not found</h3>
          <p>Please go back and choose another salon.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container section">
      <div className="profile-header">
        <div>
          <span className="eyebrow">Appointment request</span>
          <h1>Book {salon.name}</h1>
          <p>
            Choose your services, employee, date, and time. The salon owner will
            confirm your request.
          </p>
        </div>
      </div>

      <div className="booking-page-layout">
        <form className="booking-form-panel" onSubmit={handleSubmit}>
          <div className="booking-section-box">
            <h2>
              <Scissors size={22} />
              Choose Services
            </h2>
            <p>Select one or more services for this appointment.</p>

            {services.length === 0 ? (
              <div className="empty-state">
                <h3>No services available</h3>
                <p>This salon has no active services right now.</p>
              </div>
            ) : (
              <div className="booking-services-select-grid">
                {services.map((service) => {
                  const selected = selectedServiceIds.includes(
                    Number(service.id),
                  );

                  return (
                    <label
                      className={
                        selected
                          ? "booking-service-option selected"
                          : "booking-service-option"
                      }
                      key={service.id}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => handleServiceToggle(service.id)}
                      />

                      <h3>{service.name}</h3>
                      <p>{service.description || "No description provided."}</p>

                      <div className="booking-service-meta">
                        <span>{service.price} JD</span>
                        <span>{service.durationMinutes} min</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="booking-section-box">
            <h2>
              <UserRound size={22} />
              Choose Employee
            </h2>
            <p>
              Choose a specific employee, or keep it as any available employee.
            </p>

            <div className="employee-booking-select-grid">
              <label
                className={
                  selectedEmployeeId === ""
                    ? "employee-booking-option selected"
                    : "employee-booking-option"
                }
              >
                <input
                  type="radio"
                  name="selectedEmployee"
                  value=""
                  checked={selectedEmployeeId === ""}
                  onChange={() => setSelectedEmployeeId("")}
                />

                <div className="employee-booking-avatar any-employee-avatar">
                  <UserRound size={24} />
                </div>

                <div>
                  <h3>Any available employee</h3>
                  <p>
                    The salon owner will assign the best available employee.
                  </p>
                </div>
              </label>

              {eligibleEmployees.map((employee) => (
                <label
                  className={
                    Number(selectedEmployeeId) === Number(employee.id)
                      ? "employee-booking-option selected"
                      : "employee-booking-option"
                  }
                  key={employee.id}
                >
                  <input
                    type="radio"
                    name="selectedEmployee"
                    value={employee.id}
                    checked={Number(selectedEmployeeId) === Number(employee.id)}
                    onChange={() => setSelectedEmployeeId(String(employee.id))}
                  />

                  <div className="employee-booking-avatar">
                    {employee.imageUrl ? (
                      <img src={employee.imageUrl} alt={employee.fullName} />
                    ) : (
                      employee.fullName?.charAt(0)?.toUpperCase() || "E"
                    )}
                  </div>

                  <div>
                    <h3>{employee.fullName}</h3>
                    <p>{employee.specialty || "Salon Employee"}</p>
                    <span>
                      {employee.startTime?.toString().slice(0, 5)} -{" "}
                      {employee.endTime?.toString().slice(0, 5)}
                    </span>
                  </div>
                </label>
              ))}
              {selectedServiceIds.length > 0 &&
                eligibleEmployees.length === 0 && (
                  <p className="booking-availability-note">
                    No active employee is currently listed for all selected
                    services. You can still send the request and let the salon
                    assign someone.
                  </p>
                )}
            </div>
          </div>

          <div className="booking-section-box">
            <h2>
              <CalendarDays size={22} />
              Appointment Details
            </h2>
            <p>Add your contact details and preferred appointment time.</p>

            <div className="booking-input-grid">
              <div className="booking-input-group">
                <label>
                  <Phone size={16} />
                  Phone Number
                </label>
                <input
                  type="text"
                  value={customerPhoneNumber}
                  onChange={(e) => setCustomerPhoneNumber(e.target.value)}
                  placeholder="Example: 0790000000"
                />
              </div>

              <div className="booking-input-group">
                <label>
                  <MapPin size={16} />
                  Your Location
                </label>
                <input
                  type="text"
                  value={customerLocation}
                  onChange={(e) => setCustomerLocation(e.target.value)}
                  placeholder="Example: Amman - Jordan"
                />
              </div>

              <div className="booking-input-group">
                <label>
                  <CalendarDays size={16} />
                  Booking Date
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  min={getTodayDate()}
                  onChange={(e) => setBookingDate(e.target.value)}
                />
              </div>

              <div className="booking-input-group">
                <label>
                  <Clock size={16} />
                  Booking Time
                </label>
                <input
                  type="time"
                  value={bookingTime}
                  min={
                    bookingDate === getTodayDate()
                      ? getEarliestBookingTime()
                      : undefined
                  }
                  onChange={(e) => setBookingTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="booking-section-box">
            <h2>
              <StickyNote size={22} />
              Extra Note
            </h2>
            <p>You can write anything the salon owner should know.</p>

            <div className="booking-input-group">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Example: I prefer a quiet time, or I need hair and beard together..."
              />
            </div>
          </div>

          <div className="booking-submit-row">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Sending Request..." : "Confirm Booking"}
            </button>
          </div>
        </form>

        <aside className="booking-side-panel">
          <span className="eyebrow">Summary</span>
          <h3>{salon.name}</h3>
          <p>
            {salon.city} • {salon.address}
          </p>
          <p>
            Working hours: {salon.openTime?.toString().slice(0, 5)} -{" "}
            {salon.closeTime?.toString().slice(0, 5)}
          </p>

          <div className="booking-summary-total">
            <p>Selected services: {selectedServices.length}</p>
            <p>Total duration: {totalDuration} min</p>

            {selectedEmployeeId ? (
              <p>
                Employee:{" "}
                {
                  employees.find(
                    (employee) =>
                      Number(employee.id) === Number(selectedEmployeeId),
                  )?.fullName
                }
              </p>
            ) : (
              <p>Employee: Any available employee</p>
            )}

            <span>Total price</span>
            <strong>{totalPrice} JD</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default CreateBooking;
