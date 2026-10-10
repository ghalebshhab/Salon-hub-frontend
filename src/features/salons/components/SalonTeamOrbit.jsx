import { Crown, Mail, Clock, UserRound, Sparkles } from "lucide-react";

function SalonTeamOrbit({ salon, employees = [] }) {
  const safeEmployees = employees || [];

  const getInitials = (name) => {
    if (!name) return "E";

    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getPositionStyle = (index, total) => {
    if (total === 0) return {};

    const angle = (360 / total) * index - 90;
    const radius = total <= 3 ? 145 : 170;

    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;

    return {
      transform: `translate(${x}px, ${y}px)`,
    };
  };

  const formatTime = (time) => {
    if (!time) return "-";
    return time.toString().slice(0, 5);
  };

  const getStatusClass = (status) => {
    if (!status) return "status-invited";
    return `status-${status.toLowerCase()}`;
  };

  return (
    <section className="team-orbit-section">
      <div className="team-orbit-heading">
        <span className="eyebrow">Meet the team</span>
        <h2>Owner & Salon Team</h2>
        <p>
          Explore the people behind this salon, their specialties, working
          hours, and invitation status.
        </p>
      </div>

      <div className="team-orbit-wrapper">
        <div className="team-orbit-ring">
          <div className="orbit-circle orbit-circle-one"></div>
          <div className="orbit-circle orbit-circle-two"></div>

          <div className="team-owner-card">
            <div className="owner-crown-badge">
              <Crown size={18} />
            </div>

            <div className="team-owner-avatar">
              <Crown size={34} />
            </div>

            <h3>{salon?.ownerName || "Salon Owner"}</h3>
            <p>Owner</p>

            <span className="owner-premium-badge">
              <Sparkles size={13} />
              Team Leader
            </span>
          </div>

          {safeEmployees.map((employee, index) => (
            <div
              className="team-employee-node"
              style={getPositionStyle(index, safeEmployees.length)}
              key={employee.id || index}
            >
              <div
                className={`team-employee-avatar ${getStatusClass(employee.status)}`}
              >
                {employee.imageUrl ? (
                  <img src={employee.imageUrl} alt={employee.fullName} />
                ) : (
                  <span>{getInitials(employee.fullName)}</span>
                )}
              </div>

              <h4>{employee.fullName || "Employee"}</h4>
              <p>{employee.specialty || "Salon Employee"}</p>

              <div className="team-hover-card">
                <div className="team-hover-header">
                  <div
                    className={`team-hover-avatar ${getStatusClass(employee.status)}`}
                  >
                    {employee.imageUrl ? (
                      <img src={employee.imageUrl} alt={employee.fullName} />
                    ) : (
                      <UserRound size={20} />
                    )}
                  </div>

                  <div>
                    <strong>{employee.fullName || "Employee"}</strong>
                    <span>{employee.specialty || "Salon Employee"}</span>
                  </div>
                </div>

                <small>
                  <Mail size={13} />
                  {employee.email || "No email"}
                </small>

                <small>
                  <Clock size={13} />
                  {formatTime(employee.startTime)} -{" "}
                  {formatTime(employee.endTime)}
                </small>

                <em
                  className={`employee-status-pill ${getStatusClass(employee.status)}`}
                >
                  {employee.status || "INVITED"}
                </em>
              </div>
            </div>
          ))}

          {safeEmployees.length === 0 && (
            <div className="team-empty-message">
              <UserRound size={30} />
              <h3>No employees yet</h3>
              <p>The salon team will appear here soon.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default SalonTeamOrbit;
