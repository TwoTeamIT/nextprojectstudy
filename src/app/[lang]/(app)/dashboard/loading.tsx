import { Skeleton } from "@mui/material";

export default function ReportLoading() {
  return (
    <>
      <Skeleton
        className={`mt-8`}
        variant="rectangular"
        width={"100%"}
        height={500}
      />
    </>
  );
}
