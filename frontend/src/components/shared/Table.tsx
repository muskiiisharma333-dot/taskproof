import React, { useState, useMemo } from "react";

interface Column {
  key: string;
  header: string;
  render?: (val: any, row: any) => React.ReactNode;
  sortable?: boolean;
}

interface TableProps {
  data: any[];
  columns: Column[];
  searchPlaceholder?: string;
  searchFields?: string[];
  initialRowsPerPage?: number;
  mobileCardRender?: (row: any) => React.ReactNode;
}

export const Table: React.FC<TableProps> = ({
  data,
  columns,
  searchPlaceholder = "Search...",
  searchFields = [],
  initialRowsPerPage = 5,
  mobileCardRender,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  // Sorting Handler
  const handleSort = (key: string, sortable?: boolean) => {
    if (sortable === false) return;
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  // Filtered & Sorted Data
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((row) => {
        const fieldsToSearch = searchFields.length > 0 ? searchFields : Object.keys(row);
        return fieldsToSearch.some((field) => {
          const val = row[field];
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(q);
        });
      });
    }

    // Apply Sort
    if (sortConfig) {
      const { key, direction } = sortConfig;
      result.sort((a, b) => {
        let valA = a[key];
        let valB = b[key];

        // Format dates or convert to numbers if appropriate
        if (typeof valA === "string" && !isNaN(Date.parse(valA))) {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        }

        if (valA < valB) return direction === "asc" ? -1 : 1;
        if (valA > valB) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, sortConfig, searchFields]);

  // Pagination bounds
  const totalEntries = processedData.length;
  const totalPages = Math.ceil(totalEntries / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const paginatedData = useMemo(() => {
    return processedData.slice(startIdx, startIdx + rowsPerPage);
  }, [processedData, startIdx, rowsPerPage]);

  const showingStart = totalEntries === 0 ? 0 : startIdx + 1;
  const showingEnd = Math.min(startIdx + rowsPerPage, totalEntries);

  return (
    <div className="flex flex-col w-full">
      {/* Top Search Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center px-6 py-4 border-b border-white/20">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant select-none" style={{ fontSize: "20px" }}>
            search
          </span>
          <input
            type="text"
            className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-body-md focus:outline-none transition-all"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="flex items-center gap-2 select-none text-sm text-on-surface-variant font-semibold">
          <span>Show</span>
          <select
            className="glass-input rounded-lg px-2 py-1 focus:outline-none border-none text-on-surface"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>entries</span>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="w-full overflow-x-auto no-scrollbar">
        {/* Mobile Cards layout if mobileCardRender is provided */}
        {mobileCardRender && (
          <div className="md:hidden p-4 space-y-4">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <div key={idx} className="block">
                  {mobileCardRender(row)}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-on-surface-variant">No matching records found</div>
            )}
          </div>
        )}

        {/* Standard Table (Hidden on Mobile if card render is supplied, otherwise visible) */}
        <table className={`w-full text-left border-collapse min-w-[700px] ${mobileCardRender ? "hidden md:table" : "table"}`}>
          <thead>
            <tr className="border-b border-white/25 bg-surface/30">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key, col.sortable)}
                  className={`p-4 font-label-sm text-label-sm text-on-surface-variant font-bold select-none ${
                    col.sortable !== false ? "cursor-pointer hover:text-primary transition-colors" : ""
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable !== false && (
                      <span className="material-symbols-outlined text-[14px]">
                        {sortConfig?.key === col.key
                          ? sortConfig.direction === "asc"
                            ? "arrow_drop_up"
                            : "arrow_drop_down"
                          : "unfold_more"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 font-body-md text-body-md text-on-surface">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-primary-container/10 transition-colors group">
                  {columns.map((col) => (
                    <td key={col.key} className="p-4 align-middle">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-on-surface-variant font-decorative-callout text-2xl">
                  No matching entries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="border-t border-white/25 p-4 flex flex-col sm:flex-row gap-3 items-center justify-between bg-surface/20">
        <span className="text-xs text-on-surface-variant font-semibold">
          Showing {showingStart} to {showingEnd} of {totalEntries} entries
        </span>
        {totalPages > 1 && (
          <div className="flex gap-1 select-none">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isCurrent = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded text-label-sm font-semibold flex items-center justify-center transition-colors ${
                    isCurrent
                      ? "bg-primary-container text-on-primary-container shadow-sm border border-primary-container"
                      : "text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1 rounded text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
