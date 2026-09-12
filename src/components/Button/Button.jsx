
import "./Button.css";

const Button = ({
  children,
  variant = "primary", // "primary" | "secondary" | "outline"
  type = "button",
  onClick,
  disabled = false,
  icon: Icon,
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      className={`app-btn btn-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className="btn-icon" />}
      {children}
    </button>
  );
};

export default Button;