import "./DataTable.css";

const DataTable = ({
  columns = [],
  data = [],
  rowKey = "id",
  loading = false,
  emptyMessage = "No records found.",
}) => {
  return (
    <div className="data-table-wrapper">
      <div className="data-table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={column.headerClassName || ""}
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="data-table-state"
                >
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="data-table-state"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={row[rowKey] ?? index}>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={column.cellClassName || ""}
                    >
                      {column.render
                        ? column.render(row, index)
                        : row[column.key] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;