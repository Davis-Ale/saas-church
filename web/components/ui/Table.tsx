import type { ReactNode } from "react";

export interface TableColumn<T extends object> {
  key: keyof T & string;
  label: string;
  render?: (value: unknown, row: T) => ReactNode;
}

interface TableProps<T extends object> {
  columns: TableColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}

export default function Table<T extends object>({
  columns,
  data,
  onRowClick,
}: TableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <table className="w-full">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-4 text-left text-sm font-medium text-gray-700"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-gray-500"
              >
                No data
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className={
                  onRowClick ? "cursor-pointer hover:bg-gray-50" : ""
                }
              >
                {columns.map((column) => {
                  const value = row[column.key];

                  return (
                    <td key={column.key} className="px-6 py-4">
                      {column.render
                        ? column.render(value, row)
                        : value === null || value === undefined
                          ? null
                          : String(value)}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
