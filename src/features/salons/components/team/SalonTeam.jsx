import { useMemo, useState } from "react";
import { UsersRound } from "lucide-react";
import TeamMemberCard from "./TeamMemberCard.jsx";
import {
  ALL_SPECIALTIES,
  TEAM_PREVIEW_COUNT,
  specialtyFilters,
  specialtyOf,
  teamSummary,
} from "../../model/salonTeam.js";
import t from "../../../../shared/i18n/t.js";

/**
 * The salon's professionals on the public page: a short summary, a
 * specialty filter for bigger teams, and one card per person.
 * `booking` is null for people who cannot book here (the owner).
 */
export default function SalonTeam({ employees = [], booking = null }) {
  const [specialty, setSpecialty] = useState(ALL_SPECIALTIES);
  const [showAll, setShowAll] = useState(false);
  const summary = useMemo(() => teamSummary(employees), [employees]);
  const filters = useMemo(() => specialtyFilters(employees), [employees]);

  if (!employees.length) {
    return (
      <div className="team-empty">
        <span className="team-empty-icon" aria-hidden="true">
          <UsersRound size={26} />
        </span>
        <h3>{t("The team is on its way")}</h3>
        <p>
          {t(
            "Professionals show here after they join the salon. You can still book, and the salon chooses who serves you.",
          )}
        </p>
      </div>
    );
  }

  const visible =
    specialty === ALL_SPECIALTIES
      ? employees
      : employees.filter((employee) => specialtyOf(employee) === specialty);
  const shown = showAll ? visible : visible.slice(0, TEAM_PREVIEW_COUNT);
  const hidden = visible.length - shown.length;

  return (
    <div className="team">
      <ul className="team-summary" aria-label={t("Team at a glance")}>
        <li>
          <strong>{summary.people}</strong>
          {summary.people === 1 ? t("professional") : t("professionals")}
        </li>
        {summary.years > 0 && (
          <li>
            <strong>{summary.years}</strong>
            {summary.years === 1 ? t("year") : t("years")}{" "}
            {t("of combined experience")}
          </li>
        )}
        {summary.services > 0 && (
          <li>
            <strong>{summary.services}</strong>
            {summary.services === 1 ? t("service") : t("services")}{" "}
            {t("covered")}
          </li>
        )}
      </ul>

      {filters.length > 0 && (
        <div
          className="team-filters"
          role="group"
          aria-label={t("Filter the team by specialty")}
        >
          <span className="team-filters-label" aria-hidden="true">
            {t("Specialty")}
          </span>
          {[
            {
              label: t("Everyone"),
              value: ALL_SPECIALTIES,
              count: employees.length,
            },
            ...filters.map((item) => ({ ...item, value: item.label })),
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              className="team-filter"
              aria-pressed={specialty === item.value}
              onClick={() => {
                setSpecialty(item.value);
                setShowAll(false);
              }}
            >
              {t(item.label)}
              <span aria-hidden="true">{item.count}</span>
            </button>
          ))}
        </div>
      )}

      <div
        className={`team-grid ${shown.length === 1 ? "is-single" : ""}`}
        aria-live="polite"
      >
        {shown.map((employee) => (
          <TeamMemberCard
            key={employee.id}
            employee={employee}
            booking={booking}
          />
        ))}
      </div>

      {hidden > 0 && (
        <button
          className="btn btn-secondary team-show-all"
          type="button"
          onClick={() => setShowAll(true)}
        >
          {hidden === 1
            ? t("Show 1 more professional")
            : t("Show {count} more professionals", { count: hidden })}
        </button>
      )}
    </div>
  );
}
