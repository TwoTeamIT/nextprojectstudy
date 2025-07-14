import {
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  GridCsvExportMenuItem,
  GridToolbarExportContainer,
  GridToolbarProps,
  QuickFilter,
  Toolbar,
} from "@mui/x-data-grid-pro";
import { Box } from "@mui/material";

export default function GridToolbar(props: GridToolbarProps) {
  return (
    <Toolbar {...props} className="pb-2 mb-2 border-b">
      {!props.hidden && (
        <>
          <ColumnsPanelTrigger />
          <FilterPanelTrigger />
          {/* <GridToolbarDensitySelector /> */}
          <GridToolbarExportContainer>
            <GridCsvExportMenuItem />
          </GridToolbarExportContainer>
        </>
      )}
      {props.children}
      {!props.hidden && (
        <>
          <Box sx={{ flexGrow: 1 }} />
          <QuickFilter />
        </>
      )}
    </Toolbar>
  );
}
