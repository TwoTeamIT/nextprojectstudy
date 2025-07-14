"use client";

import NoRowsPlaceholder from "./NoRowsPlaceholder";
import {
  DataGridPro as DataGrid,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridColDef,
  GridToolbarContainerProps,
} from "@mui/x-data-grid-pro";
import { Menu, MenuItem, Button, Tooltip, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { itIT, enUS } from "@mui/x-data-grid/locales"
import { OpenInNew, Restore, Save } from "@mui/icons-material";
import GridToolbar from "./GridToolbar";
import Pagination from "./Pagination";
import { deepEqual } from "@/lib/deepCompare";
import { Locale } from "@/i18n-config";

type DataGridGeneratorProps<T> = {
  data: T[];
  columns: GridColDef[];
  loading: boolean;
  lang: Locale;
  viewDetails?:
  | {
    baseRoute: string;
    detailsLabel: string;
  }
  | undefined;
  toolbarActions?: GridToolbarContainerProps["children"];
  rowIdField?: string;
  getRowId?: (row: T) => string | number;
  onSaveChanges?: (initialData: T[], updatedData: T[]) => Promise<void>;
};

export default function DataGridGenerator<T extends object>({
  data,
  columns,
  loading,
  lang,
  viewDetails,
  toolbarActions,
  rowIdField,
  getRowId,
  onSaveChanges,
}: DataGridGeneratorProps<T>) {
  const router = useRouter();

  const [selectedRowId, setSelectedRowId] = useState<
    number | string | undefined
  >(undefined);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const [gridData, setGridData] = useState<T[]>(data);
  const [initialData, setInitialData] = useState<T[]>(data);

  const [isDirty, setIsDirty] = useState(false);

  const getRowIdFunc = getRowId
    ? getRowId
    : rowIdField
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (row: any) => row[rowIdField] as string | number
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (row: any) => row[0] as string | number;

  useEffect(() => {
    setGridData(data);
    setInitialData(data);
    setIsDirty(false);
  }, [data]);

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!viewDetails) return;

    const rowId = event.currentTarget.getAttribute("data-id");
    setSelectedRowId(rowId ? rowId : undefined);
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
        : null
    );
  };

  const handleClose = () => setContextMenu(null);

  const handleViewDetails = () => {
    if (viewDetails && selectedRowId)
      router.push(`/${viewDetails.baseRoute}/${selectedRowId}`);
    handleClose();
  };

  const handleSave = async () => {
    if (onSaveChanges) await onSaveChanges(initialData, gridData);

    setIsDirty(false);
  };

  const handleProcessRowUpdate = (updatedRow: T) => {
    const originalRow = gridData.find(
      (row) => getRowIdFunc(row) === getRowIdFunc(updatedRow)
    );

    if (!originalRow) return updatedRow;

    if (!deepEqual(updatedRow, originalRow)) {
      const updatedRows = gridData.map((row) =>
        getRowIdFunc(row) === getRowIdFunc(updatedRow) ? updatedRow : row
      );
      setGridData(updatedRows);
      setIsDirty(true);
    }

    return updatedRow;
  };

  const handleCancel = () => {
    setGridData(initialData);
    setIsDirty(false);
  };

  return (
    <>
      <DataGrid
        rows={gridData}
        columns={columns}
        getRowId={getRowIdFunc}
        showCellVerticalBorder
        showColumnVerticalBorder
        checkboxSelection
        disableRowSelectionOnClick
        ignoreDiacritics
        isCellEditable={(params) => params.colDef.editable === true}
        loading={loading}
        pagination
        columnBufferPx={100}
        slotProps={{
          loadingOverlay: {
            variant: "skeleton",
            noRowsVariant: "skeleton",
          },
          toolbar: {
            hidden: isDirty,
            //showQuickFilter: true,
            children: (
              <>
                {isDirty ? (
                  <Box marginBottom={0.5} marginTop={0.3}>
                    <Tooltip title="Salva">
                      <Button
                        size="small"
                        onClick={handleSave}
                        startIcon={<Save />}
                      >
                        Salva
                      </Button>
                    </Tooltip>
                    <Tooltip title="Annulla">
                      <Button
                        size="small"
                        onClick={handleCancel}
                        startIcon={<Restore />}
                      >
                        Annulla
                      </Button>
                    </Tooltip>
                  </Box>
                ) : (
                  toolbarActions
                )}
              </>
            ),
          },
          row: {
            onContextMenu: handleContextMenu,
            style: { cursor: "context-menu" },
          },
          noRowsOverlay: {
            children: (
              <>
                {
                  (lang === "it" ? itIT : enUS).components.MuiDataGrid
                    .defaultProps.localeText.noRowsLabel
                }
              </>
            ),
          },
        }}
        localeText={
          (lang === "it" ? itIT : enUS).components.MuiDataGrid.defaultProps
            .localeText
        }
        slots={{
          noRowsOverlay: NoRowsPlaceholder,
          noResultsOverlay: NoRowsPlaceholder,
          toolbar: GridToolbar,
          pagination: Pagination,
        }}
        initialState={{
          filter: {
            filterModel: {
              items: [],
              quickFilterExcludeHiddenColumns: true,
            },
          },
          pagination: { paginationModel: { pageSize: 25 } },
          pinnedColumns: {
            left: [GRID_CHECKBOX_SELECTION_COL_DEF.field],
          },
        }}
        sx={{ fontSize: 14, minHeight: 350 }}
        pageSizeOptions={[10, 25, 50, 100, { value: -1, label: "All" }]}
        processRowUpdate={handleProcessRowUpdate}
        showToolbar
      />

      {viewDetails && (
        <Menu
          open={contextMenu !== null}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== null
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
          slotProps={{
            root: {
              onContextMenu: (e: React.MouseEvent<HTMLDivElement>) => {
                e.preventDefault();
                handleClose();
              },
            },
          }}
        >
          <MenuItem onClick={handleViewDetails}>
            <OpenInNew width={20} className="mr-2" /> {viewDetails.detailsLabel}
          </MenuItem>
        </Menu>
      )}
    </>
  );
}
