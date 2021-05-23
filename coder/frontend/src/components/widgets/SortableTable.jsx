import React, { useState } from "react";

/**
 * @template T
 * @typedef SortableTableColumsn
 * @param {string} name
 * @param {(T) => any} display_fn
 * @param {(T) => any} id_fn
 * @param {(T) => any} sort_fn
 */
/**
 * @param {Object} params
 * @param {string} params.id
 * @param {T[]} params.items
 * @param {SortableTableColumn[]} params.columns
 * @param {(T)=>string|number} params.id_fn - a function that gets some unique value for the item (for React keys)
 * @returns
 */
export default function SortableTable({ id, items, columns, id_fn = (item) => item.id }) {
  const [sortColumn, setSortColumn] = useState(columns[0]);
  return (
    <table id={id} className="sortable-table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              onClick={() => setSortColumn(column)}
              key={column.name}
              className={column.name == sortColumn.name ? "selected" : ""}
            >
              {column.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {_.sortBy(items, sortColumn.sort_fn).map((item) => (
          <tr key={id_fn(item)}>
            {columns.map((column) => (
              <td key={column.name}>{column.display_fn(item)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
