import useCreateMediaPost from "../hooks/useCreateMediaPost.js";

function CreateMediaPost() {
  const { form, loading, handleChange, handleSubmit } = useCreateMediaPost();

  return (
    <section className="form-page">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1>Create Media Post</h1>
        <p className="muted">Post image or video URL to your salon profile.</p>

        <div className="form-group">
          <label>Caption</label>
          <input
            name="caption"
            value={form.caption}
            onChange={handleChange}
            placeholder="Fresh fade haircut transformation"
          />
        </div>

        <div className="form-group">
          <label>Media URL</label>
          <input
            name="mediaUrl"
            value={form.mediaUrl}
            onChange={handleChange}
            placeholder="https://example.com/video.mp4"
            required
          />
        </div>

        <div className="form-group">
          <label>Media Type</label>
          <select
            name="mediaType"
            value={form.mediaType}
            onChange={handleChange}
          >
            <option value="IMAGE">IMAGE</option>
            <option value="VIDEO">VIDEO</option>
          </select>
        </div>

        {form.mediaUrl && (
          <div className="preview-box">
            <p className="muted">Preview</p>
            {form.mediaType === "VIDEO" ? (
              <video src={form.mediaUrl} controls preload="metadata" />
            ) : (
              <img src={form.mediaUrl} alt="Preview" />
            )}
          </div>
        )}

        <button className="btn btn-primary full-width" disabled={loading}>
          {loading ? "Posting..." : "Post Media"}
        </button>
      </form>
    </section>
  );
}

export default CreateMediaPost;
