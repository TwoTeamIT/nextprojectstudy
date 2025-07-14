import { z } from "zod";
import { GridColDef } from "@mui/x-data-grid";
import { reorderObjPropsByPriority } from "@/lib/manageObjProps";

export function generateColumnsFromZodSchema(
  schema: z.AnyZodObject,
  excludedColumns: string[] = [],
  editableColumns: string[] = [],
  priorityColumns: string[] = []
): GridColDef[] {
  const columns: GridColDef[] = [];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  const zodTypeToDataType = new Map<Function, string>([
    [z.ZodString, "string"],
    [z.ZodNumber, "number"],
    [z.ZodBoolean, "boolean"],
    [z.ZodDate, "date"],
  ]);

  Object.keys(schema.shape).forEach((key) => {
    if (excludedColumns.includes(key)) return;

    const fieldType = schema.shape[key];
    let dataType = "string";
    let align: "left" | "right" | "center" = "left";

    zodTypeToDataType.forEach((type, zodType) => {
      if (fieldType instanceof zodType) dataType = type;
    });

    if (dataType === "number") align = "right";
    else if (dataType === "boolean") align = "center";

    columns.push({
      field: key,
      headerName: key.charAt(0).toUpperCase() + key.slice(1),
      flex: 1,
      sortable: true,
      filterable: true,
      headerAlign: "center",
      align,
      type: dataType as GridColDef["type"],
      minWidth: dataType === "string" ? 180 : dataType === "date" ? 100 : 80,
      editable: editableColumns.includes(key),
      /*renderHeader: (params: GridColumnHeaderParams<any, any, any>) =>
        params.field,*/
    });
  });

  return reorderObjPropsByPriority(columns, priorityColumns, "field");
}
