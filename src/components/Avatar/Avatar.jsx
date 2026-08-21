import { useState } from "react";
import "./Avatar.css";

const Avatar = ({ name = "", src = "", size = "medium" }) => {
  const [imageError, setImageError] = useState(false);

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => Array.from(word)[0])
    .join("")
    .toUpperCase();

  return (
    <div className={`avatar avatar-${size}`}>
      {src && !imageError ? (
        <img
          src={src}
          alt={name || "Employee"}
          className="avatar-image"
          onError={() => setImageError(true)}
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