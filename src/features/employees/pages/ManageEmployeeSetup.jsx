import { useMemo } from "react";
import { CalendarClock, Plus, Scissors, Trash2 } from "lucide-react";
import Loading from "../../../shared/components/Loading.jsx";
import useManageEmployeeSetup, {
  WEEK_DAYS,
} from "../hooks/useManageEmployeeSetup.js";

function timeValue(value) {
  return value?.slice(0, 5) || "";
}

function ManageEmployeeSetup() {
  const {
    capabilities,
    schedule,
    services,
    serviceIds,
    periods,
    loading,
    error,
    saving,
    setServiceIds,
    setDayPeriods,
    saveServices,
    saveSchedule,
  } = useManageEmployeeSetup();

  const periodsByDay = useMemo(
    () =>
      Object.fromEntries(
        WEEK_DAYS.map((day) => [
          day,
          periods.filter((period) => period.dayOfWeek === day),
        ]),
      ),
    [periods],
  );

  if (loading) return <Loading message="Loading employee setup…" />;
  if (error || !capabilities || !schedule) {
    return (
      <section className="container section">
        <div className="empty-state">
          <h2>Employee setup is unavailable</h2>
          <p>{error?.message || "This employee could not be loaded."}</p>
        </div>
      </section>
    );
  }

  const toggleService = (serviceId) => {
    const id = Number(serviceId);
    setServiceIds((current) =>
      (
        current ??
        capabilities.services
          .filter((item) => item.active)
          .map((item) => item.id)
      ).includes(id)
        ? (
            current ??
            capabilities.services
              .filter((item) => item.active)
              .map((item) => item.id)
          ).filter((item) => Number(item) !== id)
        : [
            ...(current ??
              capabilities.services
                .filter((item) => item.active)
                .map((item) => item.id)),
            id,
          ],
    );
  };

  const addPeriod = (day) => {
    setDayPeriods(day, (items) => [
      ...items,
      {
        dayOfWeek: day,
        startTime: timeValue(schedule.salonOpeningTime),
        endTime: timeValue(schedule.salonClosingTime),
      },
    ]);
  };

  const updatePeriod = (day, index, field, value) => {
    setDayPeriods(day, (items) =>
      items.map((period, itemIndex) =>
        itemIndex === index ? { ...period, [field]: value } : period,
      ),
    );
  };

  const removePeriod = (day, index) => {
    setDayPeriods(day, (items) =>
      items.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  return (
    <section className="container section employee-setup-page">
      <header className="profile-header">
        <div>
          <span className="eyebrow">Booking setup</span>
          <h1>{capabilities.employeeName}</h1>
          <p>
            Choose this employee’s services and weekly availability. Schedule
            times must fall between {timeValue(schedule.salonOpeningTime)} and{" "}
            {timeValue(schedule.salonClosingTime)}.
          </p>
        </div>
      </header>

      <section className="employee-setup-panel">
        <div className="employee-setup-panel-heading">
          <span className="employee-setup-panel-icon">
            <Scissors size={20} />
          </span>
          <div>
            <h2>Services they can perform</h2>
            <p>
              Customers can only choose employees qualified for every selected
              service.
            </p>
          </div>
        </div>
        {services.length === 0 ? (
          <p className="muted">
            Add an active service to your salon before assigning employee
            capabilities.
          </p>
        ) : (
          <div className="employee-service-options">
            {services.map((service) => (
              <label className="employee-service-option" key={service.id}>
                <input
                  type="checkbox"
                  checked={serviceIds.map(Number).includes(Number(service.id))}
                  onChange={() => toggleService(service.id)}
                />
                <span>
                  <strong>{service.name}</strong>
                  <small>
                    {service.price} JD · {service.durationMinutes} min
                  </small>
                </span>
              </label>
            ))}
          </div>
        )}
        <div className="employee-setup-actions">
          <button
            className="btn btn-primary"
            type="button"
            onClick={saveServices}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save services"}
          </button>
        </div>
      </section>

      <section className="employee-setup-panel">
        <div className="employee-setup-panel-heading">
          <span className="employee-setup-panel-icon">
            <CalendarClock size={20} />
          </span>
          <div>
            <h2>Weekly schedule</h2>
            <p>
              Add one or more work periods for each day. Leave a day empty for a
              day off.
            </p>
          </div>
        </div>
        <div className="employee-week-grid">
          {WEEK_DAYS.map((day) => (
            <div className="employee-day-row" key={day}>
              <strong>{day[0] + day.slice(1).toLowerCase()}</strong>
              <div className="employee-day-periods">
                {periodsByDay[day].map((period, index) => (
                  <div
                    className="employee-period-inputs"
                    key={`${day}-${index}`}
                  >
                    <label>
                      <span className="sr-only">Start time</span>
                      <input
                        type="time"
                        value={timeValue(period.startTime)}
                        onChange={(event) =>
                          updatePeriod(
                            day,
                            index,
                            "startTime",
                            event.target.value,
                          )
                        }
                      />
                    </label>
                    <span>to</span>
                    <label>
                      <span className="sr-only">End time</span>
                      <input
                        type="time"
                        value={timeValue(period.endTime)}
                        onChange={(event) =>
                          updatePeriod(
                            day,
                            index,
                            "endTime",
                            event.target.value,
                          )
                        }
                      />
                    </label>
                    <button
                      className="icon-button danger"
                      type="button"
                      aria-label={`Remove ${day.toLowerCase()} period`}
                      onClick={() => removePeriod(day, index)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  className="employee-add-period"
                  type="button"
                  onClick={() => addPeriod(day)}
                >
                  <Plus size={15} /> Add hours
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="employee-setup-actions">
          <button
            className="btn btn-primary"
            type="button"
            onClick={saveSchedule}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save schedule"}
          </button>
        </div>
      </section>
    </section>
  );
}

export default ManageEmployeeSetup;
