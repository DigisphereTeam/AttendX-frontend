import { useEffect } from "react";
import { FiAlertTriangle } from "react-icons/fi";

import "./ConfirmDialog.css";

const ConfirmDialog = ({
  show,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "Do you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  disabled = false,
  isLoading = false,
}) => {
  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && show && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [show, isLoading, onClose]);

  if (!show) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  return (
    <div 
      className="modal fade show d-block confirm-dialog-backdrop" 
      tabIndex="-1"
      onClick={handleBackdropClick}
    >
      <div className="modal-dialog modal-dialog-centered confirm-dialog-modal">
        <div className="modal-content">
          
          {/* Header */}
          <div className="modal-header confirm-dialog-header">
            <h5 className="modal-title confirm-dialog-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              disabled={isLoading}
              onClick={onClose}
            />
          </div>

          {/* Body */}
          <div className="modal-body confirm-dialog-body">
            <div className="confirm-dialog-message-wrapper">
              <div className="confirm-dialog-warning-icon">
                <FiAlertTriangle />
              </div>
              <p className="confirm-dialog-message-text">{message}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer confirm-dialog-footer">
            <button
              type="button"
              className="btn confirm-dialog-cancel-button"
              onClick={onClose}
              disabled={disabled || isLoading}
            >
              {cancelText}
            </button>

            <button
              type="button"
              className="btn confirm-dialog-confirm-button"
              onClick={onConfirm}
              disabled={disabled || isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Deleting...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;