function AddButton({ onClick, label = "Tambah", className = "", icon = null }) {
  return (
    <button
      className={`btn btn-primary ${className}`}
      onClick={onClick}
      type="button"
    >
      {icon && <span className="me-2">{icon}</span>}
      {label}
    </button>
  );
}

export default AddButton;

