import "./StatCard.css";

const StatCard = ({
  title,
  value,
  icon: Icon,
  className = "",
}) => {
  return (
    <div className={`stat-card ${className}`}>
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>

        {Icon && (
          <span className="stat-card-icon">
            <Icon />
          </span>
        )}
      </div>

      <div className="stat-card-value">
        {value}
      </div>
    </div>
  );
};

export default StatCard;