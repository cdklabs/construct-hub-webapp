/**
 * @fileoverview CSS Related Utils
 */

/**
 * Translates a series of grid row definitions into a grid area string
 * ```ts
 * const gridAreas = makeGridAreas(
 *  ["header", "header", "header"],
 *  ["aside", "main", "main"],
 *  ["aside", "footer", "footer"]
 * ); // `"header header header" "aside main main" "aside footer footer"`
 * ```
 */
export const makeGridAreas = (...rows: string[][]): string => {
  return rows.map((row) => `"${row.join(" ")}"`).join(" ");
};
