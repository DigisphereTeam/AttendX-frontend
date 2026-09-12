import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import Button from "../Button/Button";
import "./CommonModal.css";

const CommonModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  primaryLabel,
  onPrimaryClick,
  primaryVariant = "primary",
  primaryIcon,
  secondaryLabel = null, // Default to null so it doesn't auto-render
  onSecondaryClick,
  secondaryVariant = "secondary",
  isSubmitting = false,
  showFooter = false, // Explicit control over footer visibility
  customFooter = null, // Custom buttons slot if needed
  formId, // Optional: trigger form submit remotely via footer
  maxWidth = "520px",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Render footer only if explicitly requested, or if labels/customFooter exist
  const shouldRenderFooter =
    showFooter || Boolean(primaryLabel) || Boolean(secondaryLabel) || Boolean(customFooter);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            {title && <h2 className="modal-title">{title}</h2>}
            {subtitle && <p className="modal-subtitle">{subtitle}</p>}
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FiX />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="modal-body">{children}</div>

        {/* Footer */}
        {shouldRenderFooter && (
          <div className="modal-footer">
            {customFooter ? (
              customFooter
            ) : (
              <>
                {secondaryLabel && (
                  <Button
                    type="button"
                    variant={secondaryVariant}
                    onClick={onSecondaryClick || onClose}
                    disabled={isSubmitting}
                  >
                    {secondaryLabel}
                  </Button>
                )}
                {primaryLabel && (
                  <Button
                    type={formId ? "submit" : "button"}
                    form={formId}
                    variant={primaryVariant}
                    icon={primaryIcon}
                    onClick={onPrimaryClick}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : primaryLabel}
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommonModal;