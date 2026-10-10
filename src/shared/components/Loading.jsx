function Loading({ text = "Loading..." }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span>{text}</span>
    </div>
  );
}

export default Loading;
