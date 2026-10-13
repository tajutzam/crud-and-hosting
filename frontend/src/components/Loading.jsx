function Loading({ message = "Loading...", size = "medium" }) {
  const sizeClasses = {
    small: "spinner-border-sm",
    medium: "",
    large: "spinner-border-lg"
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className={`spinner-border text-primary ${sizeClasses[size]}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {message && (
        <p className="mt-3 text-muted">{message}</p>
      )}
    </div>
  );
}

export default Loading;


