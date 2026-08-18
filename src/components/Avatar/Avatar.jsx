import "./Avatar.css";

const Avatar = ({ name = "", src = "", size = "medium" }) => {
  const initials = name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className={`avatar avatar-${size}`}>
      {src ? (
        <img
          src={src}
          alt={name || "Employee"}
          className="avatar-image"
        />
      ) : (
        <span className="avatar-initials">
          {initials || "?"}
        </span>
      )}
    </div>
  );
};

export default Avatar;