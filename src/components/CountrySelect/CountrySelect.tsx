"use client";

import {
  Autocomplete,
  Box,
  BoxProps,
  TextField,
  Typography,
  TypographyProps,
} from "@mui/material";
import countriesArray from "@/assets/countries.json";
import { useState } from "react";
//import Image from "next/image";

export type CountryType = {
  label: string;
  code: string;
  flag: string;
};

/*export type CountryType = {
  name: string;
  country_code: string;
  timezone: string;
  flag: string;
};*/

const countries = countriesArray as CountryType[];

type CountrySelectProps = {
  label?: string;
  value: CountryType | string;
  onChange?: (country: CountryType) => void;
  editable?: boolean;
  variant?: TypographyProps["variant"];
  hideName?: boolean;
  hideCode?: boolean;
  hideFlag?: boolean;
  reverse?: boolean;
  gap?: BoxProps["gap"];
};

export default function CountrySelect({
  label,
  value: initialValue,
  onChange = () => {},
  editable = true,
  variant,
  hideName = false,
  hideCode = false,
  hideFlag = false,
  reverse = false,
  gap = 1,
}: CountrySelectProps) {
  const [selectedValue, setSelectedValue] = useState<CountryType | undefined>(
    typeof initialValue === "string"
      ? countries.find((c) => c.label === initialValue)
      : initialValue
  );
  const handleChange = (event: React.SyntheticEvent, value: CountryType) => {
    setSelectedValue(value);
    onChange(value);
  };

  return editable ? (
    <Autocomplete
      options={countries.sort((a, b) => a.code.localeCompare(b.code))}
      disableCloseOnSelect
      disableClearable
      getOptionLabel={(option: CountryType) =>
        `${option.label} (${option.code})`
      }
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <Box
            key={key}
            component="li"
            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
            {...optionProps}
          >
            <img
              alt={`${option.label}`}
              loading="lazy"
              width={40}
              height={30}
              src={option.flag}
              style={{ border: "1px solid #ccc", borderRadius: 2 }}
            />
            {option.label} ({option.code})
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          margin="normal"
          {...params}
          label={label ?? "Choose a country"}
        />
      )}
      onChange={handleChange}
      value={selectedValue}
    />
  ) : (
    selectedValue && (
      <Box
        key={selectedValue?.code}
        className={`flex items-center gap-2`}
        sx={{
          flexDirection: reverse ? "row-reverse" : "row",
          "& > img": { mr: 2, flexShrink: 0 },
        }}
        gap={gap}
      >
        {!hideFlag && (
          <img
            alt={`Flag of ${selectedValue?.label}`}
            loading="lazy"
            width={40}
            height={30}
            src={selectedValue?.flag}
            style={{ border: "1px solid #ccc", borderRadius: 2, margin: 0 }}
          />
        )}
        <Typography variant={variant}>
          {!hideName && selectedValue?.label}
          {!hideCode && ` (${selectedValue?.code})`}
        </Typography>
      </Box>
    )
  );
}
