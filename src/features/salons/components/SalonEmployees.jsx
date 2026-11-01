import { BriefcaseBusiness, Scissors, Sparkles, UserRound } from "lucide-react";

const initials = (name) =>
  (name || "Salon professional")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function SalonEmployees({ employees = [] }) {
  if (!employees.length) {
    return (
      <div className="salon-team-empty">
        <UserRound size={30} />
        <h3>The team is growing</h3>
        <p>Active salon professionals will be introduced here.</p>
      </div>
    );
  }

  return (
    <div className="salon-public-team-grid">
      {employees.map((employee) => (
        <article className="salon-public-employee" key={employee.id}>
          <div className="salon-employee-avatar">
            {employee.imageUrl ? <img src={employee.imageUrl} alt={employee.fullName} /> : <span>{initials(employee.fullName)}</span>}
          </div>
          <div className="salon-employee-copy">
            <span className="salon-employee-role"><Sparkles size={13} /> {employee.specialty || "Salon professional"}</span>
            <h3>{employee.fullName}</h3>
            {employee.yearsOfExperience != null && <p className="salon-employee-experience"><BriefcaseBusiness size={15} /> {employee.yearsOfExperience} years of experience</p>}
            {employee.professionalBio && <p className="salon-employee-bio">{employee.professionalBio}</p>}
            <div className="salon-employee-skills" aria-label={`${employee.fullName} skills`}>
              {(employee.skills || []).slice(0, 5).map((skill) => <span key={skill}>{skill}</span>)}
            </div>
            {!!employee.serviceNames?.length && <div className="salon-employee-services"><Scissors size={15} /><span>{employee.serviceNames.join(" · ")}</span></div>}
          </div>
        </article>
      ))}
    </div>
  );
}
