import {
  gridPageCountSelector,
  gridPageSelector,
  GridPagination,
} from "@mui/x-data-grid-pro";
import { useGridApiContext, useGridSelector } from "@mui/x-data-grid";
import {
  Pagination as MuiPagination,
  PaginationItem,
  TablePaginationProps,
} from "@mui/material";

function PaginationFunciton({
  //page,
  //onPageChange,
  className,
}: Pick<TablePaginationProps, "page" | "onPageChange" | "className">) {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <MuiPagination
      sx={{ fontSize: 14 }}
      renderItem={(params) => (
        <PaginationItem sx={{ fontSize: 14 }} {...params} />
      )}
      color="primary"
      className={className}
      count={pageCount}
      page={page + 1}
      onChange={(_event, newPage) => apiRef.current.setPage(newPage - 1)}
    />
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Pagination(props: any) {
  return (
    <GridPagination
      style={{ fontSize: 14 }}
      ActionsComponent={PaginationFunciton}
      {...props}
    />
  );
}
