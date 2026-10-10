function SalonMediaGrid({ mediaPosts }) {
  if (!mediaPosts || mediaPosts.length === 0) {
    return (
      <div className="empty-state">
        <h3>No media posts yet</h3>
        <p>Salon images and videos will appear here.</p>
      </div>
    );
  }

  return (
    <div className="media-grid">
      {mediaPosts.map((post) => (
        <div className="media-card" key={post.id}>
          <div className="media-frame">
            {post.mediaType === "VIDEO" ? (
              <video
                src={post.mediaUrl}
                controls
                preload="metadata"
                playsInline
              />
            ) : (
              <img src={post.mediaUrl} alt={post.caption || "Salon work"} />
            )}
          </div>

          <div className="media-content">
            <p>{post.caption || "Salon work"}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SalonMediaGrid;
