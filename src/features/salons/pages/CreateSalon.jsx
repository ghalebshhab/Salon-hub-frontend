import useCreateSalon from "../hooks/useCreateSalon.js";

import { Plus, Trash2, UserPlus } from "lucide-react";

function CreateSalon() {
  const {
    form,
    setForm,
    loading,
    handleChange,
    addEmployeeCard,
    removeEmployeeCard,
    updateEmployee,
    handleSubmit,
  } = useCreateSalon();

  return (
    <section className="form-page">
      <form className="form-card create-salon-pro-form" onSubmit={handleSubmit}>
        <div className="create-salon-header">
          <span className="eyebrow">Owner setup</span>
          <h1>Create Salon</h1>
          <p className="muted">
            Create your salon profile and invite employees to join your team.
          </p>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Salon Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Royal Beauty Salon"
              required
            />
          </div>

          <div className="form-group">
            <label>Salon Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="salon@test.com"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="University Street"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone Number</label>
            <input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="+962791111111"
              required
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Irbid"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Open Time</label>
            <input
              name="openTime"
              type="time"
              value={form.openTime.slice(0, 5)}
              onChange={(e) =>
                setForm({ ...form, openTime: `${e.target.value}:00` })
              }
            />
          </div>

          <div className="form-group">
            <label>Close Time</label>
            <input
              name="closeTime"
              type="time"
              value={form.closeTime.slice(0, 5)}
              onChange={(e) =>
                setForm({ ...form, closeTime: `${e.target.value}:00` })
              }
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>State</label>
            <select name="state" value={form.state} onChange={handleChange}>
              <option value="OPEN">OPEN</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>

          <div className="form-group">
            <label>Max Employees</label>
            <input
              name="maxNumOfEmployees"
              type="number"
              min="1"
              value={form.maxNumOfEmployees}
              onChange={(e) => {
                const newMax = Number(e.target.value || 0);

                setForm({
                  ...form,
                  maxNumOfEmployees: e.target.value,
                  employees: form.employees.slice(0, newMax),
                });
              }}
            />
          </div>
        </div>

        <div className="employee-invite-section">
          <div className="employee-invite-header">
            <div>
              <span className="eyebrow">Team invitations</span>
              <h2>Employees</h2>
              <p>
                Add employees now. Each employee will receive an invitation
                email. When they register with the same email or phone, they
                will be connected automatically.
              </p>
            </div>

            <button
              className="btn btn-secondary"
              type="button"
              onClick={addEmployeeCard}
            >
              <Plus size={17} />
              Add Employee
            </button>
          </div>

          <div className="employee-count-box">
            <strong>
              {form.employees.length} / {Number(form.maxNumOfEmployees || 0)}
            </strong>
            <span>employees added</span>
          </div>

          {form.employees.length === 0 ? (
            <div className="empty-state">
              <h3>No employees added yet</h3>
              <p>You can create the salon now and add employees later.</p>
            </div>
          ) : (
            <div className="employee-invite-grid">
              {form.employees.map((employee, index) => (
                <div className="employee-invite-card" key={index}>
                  <div className="employee-card-top">
                    <div className="employee-avatar-preview">
                      {employee.imageUrl ? (
                        <img src={employee.imageUrl} alt={employee.fullName} />
                      ) : (
                        <UserPlus size={24} />
                      )}
                    </div>

                    <div>
                      <h3>Employee #{index + 1}</h3>
                      <p>{employee.specialty || "Salon team member"}</p>
                    </div>

                    <button
                      className="icon-danger-button"
                      type="button"
                      onClick={() => removeEmployeeCard(index)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      value={employee.fullName}
                      onChange={(e) =>
                        updateEmployee(index, "fullName", e.target.value)
                      }
                      placeholder="Ahmad Ali"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={employee.email}
                        onChange={(e) =>
                          updateEmployee(index, "email", e.target.value)
                        }
                        placeholder="employee@test.com"
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        value={employee.phoneNumber}
                        onChange={(e) =>
                          updateEmployee(index, "phoneNumber", e.target.value)
                        }
                        placeholder="0791111111"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Specialty</label>
                    <input
                      value={employee.specialty}
                      onChange={(e) =>
                        updateEmployee(index, "specialty", e.target.value)
                      }
                      placeholder="Barber, Hair Stylist, Nail Artist..."
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Start Time</label>
                      <input
                        type="time"
                        value={employee.startTime?.slice(0, 5)}
                        onChange={(e) =>
                          updateEmployee(
                            index,
                            "startTime",
                            `${e.target.value}:00`,
                          )
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>End Time</label>
                      <input
                        type="time"
                        value={employee.endTime?.slice(0, 5)}
                        onChange={(e) =>
                          updateEmployee(
                            index,
                            "endTime",
                            `${e.target.value}:00`,
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      value={employee.imageUrl}
                      onChange={(e) =>
                        updateEmployee(index, "imageUrl", e.target.value)
                      }
                      placeholder="https://example.com/employee.jpg"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Salon Image URLs separated by comma</label>
          <textarea
            name="Images"
            value={form.Images}
            onChange={handleChange}
            placeholder="https://example.com/1.jpg, https://example.com/2.jpg"
            rows="3"
          />
        </div>

        <button className="btn btn-primary full-width" disabled={loading}>
          {loading ? "Creating..." : "Create Salon & Send Invitations"}
        </button>
      </form>
    </section>
  );
}

export default CreateSalon;
