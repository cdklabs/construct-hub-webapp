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
 *
 * const withBlank = makeGridAreas(
 *   ["header", null, "main"]
 * ); // `"header . main"`
 * ```
 */
export const makeGridAreas = (...rows: (string | null)[][]): string => {
  return rows
    .map((row) => `"${row.map((col) => col ?? ".").join(" ")}"`)
    .join(" ");
};
