import { Add, AddCircle, Remove, RemoveCircle } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useState } from "react";

type ValueControllerProps = {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
};

export default function ValueController({
  label,
  value,
  onChange,
}: ValueControllerProps) {
  const { primary, grey } = useTheme().palette;
  const [isHover, setIsHover] = useState(false);

  const handleClick = (delta: number) => {
    onChange(value + delta);
  };

  return (
    <Box
      className="flex flex-row w-full lg:flex-col lg:w-[100px] gap-2 items-center z-[10] justify-between h-full py-2"
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Typography textAlign={"center"} textOverflow={"ellipsis"}>
        {label}
      </Typography>
      <div className="flex flex-row gap-2 lg:gap-1 items-center">
        <IconButton
          title="Remove"
          size="small"
          onClick={() => handleClick(-1)}
          sx={{
            color: grey[500],
            ":hover": { color: primary.main },
          }}
        >
          {isHover ? <RemoveCircle /> : <Remove />}
        </IconButton>
        <Typography textAlign={"center"}>{value}</Typography>
        <IconButton
          title="Add"
          size="small"
          onClick={() => handleClick(1)}
          sx={{
            color: grey[500],
            ":hover": { color: primary.main },
          }}
        >
          {isHover ? <AddCircle /> : <Add />}
        </IconButton>
      </div>
    </Box>
  );
}
