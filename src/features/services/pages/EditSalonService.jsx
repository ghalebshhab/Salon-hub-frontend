import useEditSalonService from "../hooks/useEditSalonService.js";

import { Link } from "react-router-dom";

function EditSalonService() {
  const { formData, error, loading, submitting, handleChange, handleSubmit } =
    useEditSalonService();

  if (loading) {
    return <div className="loading">Loading service...</div>;
  }

  if (error)
    return (
      <section className="container section">
        <div className="empty-state">
          <h1>Service unavailable</h1>
          <p>{error.message}</p>
          <Link to="/owner/services">Back to Services</Link>
        </div>
      </section>
    );

  return (
    <section className="container section">
      <div className="profile-header">
        <div>
          <span className="eyebrow">Edit service</span>
          <h1>Update Salon Service</h1>
          <p>Edit service information shown in your salon profile.</p>
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

        <label className="checkbox-row">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          Active service
        </label>

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </section>
  );
}

export default EditSalonService;
