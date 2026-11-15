import { Sparkles, UserRound } from "lucide-react";

function Avatar({ employee }) {
  if (employee.imageUrl) {
    return <img className="bk-avatar" src={employee.imageUrl} alt="" />;
  }
  const initials = (employee.fullName || "?")
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span className="bk-avatar" aria-hidden="true">
      {initials}
    </span>
  );
}

export default function ProfessionalStep({
  employees,
  selectedEmployeeId,
  onChoose,
}) {
  return (
    <fieldset className="bk-fieldset">
      <legend className="bk-step-title">
        <span className="eyebrow">Step 2</span>
        Who should take care of you?
        <small>
          Only professionals who can do every selected service are shown.
        </small>
      </legend>

      <div className="bk-pro-grid" role="radiogroup">
        <label
          className={`bk-pro bk-pro-any ${selectedEmployeeId === "" ? "is-selected" : ""}`}
        >
          <input
            type="radio"
            name="professional"
            className="sr-only"
            checked={selectedEmployeeId === ""}
            onChange={() => onChoose("")}
          />
          <span className="bk-avatar bk-avatar-any" aria-hidden="true">
            <Sparkles size={20} />
          </span>
          <span className="bk-pro-body">
            <strong>Let the salon assign</strong>
            <small>
              More free times. The salon picks a qualified professional and
              tells you who.
            </small>
          </span>
          <span className="bk-badge">Most times</span>
        </label>

        {employees.map((employee) => {
          const selected = Number(selectedEmployeeId) === Number(employee.id);
          return (
            <label
              key={employee.id}
              className={`bk-pro ${selected ? "is-selected" : ""}`}
            >
              <input
                type="radio"
                name="professional"
                className="sr-only"
                checked={selected}
                onChange={() => onChoose(employee.id)}
              />
              <Avatar employee={employee} />
              <span className="bk-pro-body">
                <strong>{employee.fullName}</strong>
                <small>{employee.specialty || "Salon professional"}</small>
              </span>
            </label>
          );
        })}

        {employees.length === 0 && (
          <p className="bk-inline-note">
            <UserRound size={16} aria-hidden="true" />
            No single professional is listed for these services, so the salon
            will assign one.
          </p>
        )}
      </div>
    </fieldset>
  );
}
