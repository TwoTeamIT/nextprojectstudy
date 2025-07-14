import { Grid } from "@mui/material";

interface GridListProps {
  elements: React.ReactNode[] | JSX.Element[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getElementId: (element: any) => string;
}
export default function GridList({ elements, getElementId }: GridListProps) {
  return (
    <>
      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="center"
        className="mt-6 mb-2 p-3"
      >
        {elements.map((element) => (
          <Grid
            key={`${getElementId(element)}-container`}
            size={{ xs: 12, sm: 10, md: 6, lg: 5, xl: 4 }}
          >
            {element}
          </Grid>
        ))}
      </Grid>
    </>
  );
}
