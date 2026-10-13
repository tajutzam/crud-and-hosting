function DataTable({ 
  columns = [], 
  data = [], 
  onEdit = null, 
  onDelete = null,
  loading = false,
  emptyMessage = "No data available"
}) {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            {columns.map((column, index) => (
              <th key={index} scope="col">
                {column.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th scope="col" className="text-center" style={{ width: '120px' }}>
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {column.render 
                    ? column.render(row[column.accessor], row)
                    : row[column.accessor]
                  }
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="text-center">
                  <div className="btn-group" role="group">
                    {onEdit && (
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onEdit(row)}
                        title="Edit"
                      >
                        ✏️ Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDelete(row)}
                        title="Delete"
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;

