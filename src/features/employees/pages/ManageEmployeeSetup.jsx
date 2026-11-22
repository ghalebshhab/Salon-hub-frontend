import { useMemo } from "react";
import { CalendarClock, Plus, Scissors, Trash2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { EmployeeSetupSkeleton } from "../components/EmployeesPageSkeletons.jsx";
import EmployeeTimeOffPanel from "../components/EmployeeTimeOffPanel.jsx";
import useManageEmployeeSetup, {
  WEEK_DAYS,
} from "../hooks/useManageEmployeeSetup.js";
import ErrorPage from "../../../shared/components/ErrorPage.jsx";
import classifyError from "../../../shared/errors/classifyError.js";
import t from "../../../shared/i18n/t.js";
import { serviceName } from "../../services/model/serviceText.js";

function timeValue(value) {
  return value?.slice(0, 5) || "";
}

function ManageEmployeeSetup() {
  const { employeeId } = useParams();
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

  if (loading) return <EmployeeSetupSkeleton />;
  if (error || !capabilities || !schedule) {
    return (
      <ErrorPage
        kind={classifyError(error)}
        title={t("Employee setup is unavailable")}
      />
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
          <span className="eyebrow">{t("Booking setup")}</span>
          <h1>{capabilities.employeeName}</h1>
          <p>
            {t(
              "Choose this employee’s services and weekly availability. Schedule times must fall between {open} and {close}.",
              {
                open: timeValue(schedule.salonOpeningTime),
                close: timeValue(schedule.salonClosingTime),
              },
            )}
          </p>
        </div>
      </header>

      <section className="employee-setup-panel">
        <div className="employee-setup-panel-heading">
          <span className="employee-setup-panel-icon">
            <Scissors size={20} />
          </span>
          <div>
            <h2>{t("Services they can perform")}</h2>
            <p>
              {t(
                "Customers can only choose employees qualified for every selected service.",
              )}
            </p>
          </div>
        </div>
        {services.length === 0 ? (
          <p className="muted">
            {t(
              "Add an active service to your salon before assigning employee capabilities.",
            )}
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
                  <strong>{serviceName(service)}</strong>
                  <small>
                    {t("{price} JD · {durationMinutes} min", {
                      price: service.price,
                      durationMinutes: service.durationMinutes,
                    })}
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
            {saving ? t("Saving…") : t("Save services")}
          </button>
        </div>
      </section>

      <section className="employee-setup-panel">
        <div className="employee-setup-panel-heading">
          <span className="employee-setup-panel-icon">
            <CalendarClock size={20} />
          </span>
          <div>
            <h2>{t("Weekly schedule")}</h2>
            <p>
              {t(
                "Add one or more work periods for each day. Leave a day empty for a day off.",
              )}
            </p>
          </div>
        </div>
        <div className="employee-week-grid">
          {WEEK_DAYS.map((day) => (
            <div className="employee-day-row" key={day}>
              <strong>{t(day[0] + day.slice(1).toLowerCase())}</strong>
              <div className="employee-day-periods">
                {periodsByDay[day].map((period, index) => (
                  <div
                    className="employee-period-inputs"
                    key={`${day}-${index}`}
                  >
                    <label>
                      <span className="sr-only">{t("Start time")}</span>
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
                    <span>{t("to")}</span>
                    <label>
                      <span className="sr-only">{t("End time")}</span>
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
                      aria-label={t("Remove {day} period", {
                        day: t(day[0] + day.slice(1).toLowerCase()),
                      })}
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
                  <Plus size={15} /> {t("Add hours")}
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
            {saving ? t("Saving…") : t("Save schedule")}
          </button>
        </div>
      </section>

      <EmployeeTimeOffPanel
        employeeId={capabilities.employeeId ?? employeeId}
        employeeName={capabilities.employeeName}
      />
    </section>
  );
}

export default ManageEmployeeSetup;
