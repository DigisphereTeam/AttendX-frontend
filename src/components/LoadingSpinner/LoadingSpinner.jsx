import "./LoadingSpinner.css";

const LoadingSpinner = ({ message = "Loading...", fullPage = false }) => {
  return (
    <div className={`spinner-container ${fullPage ? "full-page" : ""}`}>
      <div className="spinner" />
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;