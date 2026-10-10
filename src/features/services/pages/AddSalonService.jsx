import useCreateSalonService from "../hooks/useCreateSalonService.js";

import { Link } from "react-router-dom";

function CreateSalonService() {
  const { formData, submitting, handleChange, handleSubmit } =
    useCreateSalonService();

  return (
    <section className="container section">
      <div className="profile-header">
        <div>
          <span className="eyebrow">New service</span>
          <h1>Add Salon Service</h1>
          <p>Create a service that customers can see in your salon profile.</p>
        </div>

        <Link className="btn btn-secondary" to="/owner/services">
          Back to Services
        </Link>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Service Name</label>
          <input
            type="text"
            name="name"
            placeholder="Example: Haircut"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Describe this service..."
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-grid-two">
          <div className="form-group">
            <label>Price JD</label>
            <input
              type="number"
              name="price"
              placeholder="5"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label>Duration Minutes</label>
            <input
              type="number"
              name="durationMinutes"
              placeholder="30"
              value={formData.durationMinutes}
              onChange={handleChange}
              min="1"
            />
          </div>
        </div>

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Service"}
        </button>
      </form>
    </section>
  );
}

export default CreateSalonService;
