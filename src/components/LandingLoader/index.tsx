import { Typography, CircularProgress } from "@mui/material";

export default function LandingLoader() {
  return (
    <div className="grid items-center justify-items-center w-full h-screen">
      <div className="flex flex-col items-center gap-4">
        <CircularProgress variant="indeterminate" size="72px" />
        <Typography variant="h5" gutterBottom>
          Loading...
        </Typography>
      </div>
    </div>
  );
}
