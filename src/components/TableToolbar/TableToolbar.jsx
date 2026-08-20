import {
  FiCalendar,
  FiChevronDown,
  FiSearch,
  FiX,
} from "react-icons/fi";

import "./TableToolbar.css";

const TableToolbar = ({
  filters = [],
  values = {},
  onChange,
  onClear,
  actions,
}) => {
  const handleChange = (name, value) => {
    onChange?.(name, value);
  };

  return (
    <div className="table-toolbar">
      <div className="table-toolbar-filters">
        {filters.map((filter) => {
          if (filter.type === "search") {
            return (
              <div
                className="toolbar-search"
                key={filter.name}
              >
                <FiSearch className="toolbar-search-icon" />

                <input
                  type="text"
                  value={values[filter.name] || ""}
                  placeholder={
                    filter.placeholder || "Search..."
                  }
                  onChange={(event) =>
                    handleChange(
                      filter.name,
                      event.target.value
                    )
                  }
                />
              </div>
            );
          }

          if (filter.type === "select") {
            return (
              <div
                className="toolbar-select-wrapper"
                key={filter.name}
              >
                <select
                  className="toolbar-select"
                  value={values[filter.name] || ""}
                  onChange={(event) =>
                    handleChange(
                      filter.name,
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    {filter.placeholder || "Select"}
                  </option>

                  {filter.options?.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>

                <FiChevronDown className="toolbar-select-icon" />
              </div>
            );
          }

          if (filter.type === "date") {
            return (
              <div
                className="toolbar-date-wrapper"
                key={filter.name}
              >
                <FiCalendar className="toolbar-date-icon" />

                <input
                  type="date"
                  className="toolbar-date"
                  value={values[filter.name] || ""}
                  onChange={(event) =>
                    handleChange(
                      filter.name,
                      event.target.value
                    )
                  }
                />
              </div>
            );
          }

          return null;
        })}

        {/* Clear button now always renders if onClear callback exists */}
        {onClear && (
          <button
            type="button"
            className="toolbar-clear-button"
            onClick={onClear}
          >
            <FiX />
            Clear
          </button>
        )}
      </div>

      {actions && (
        <div className="table-toolbar-actions">
          {actions}
        </div>
      )}
    </div>
  );
};

export default TableToolbar;