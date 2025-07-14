import { ChangeEvent } from "react";
import {
  Checkbox,
  TextField,
  Typography,
  TypographyProps,
  FormControlLabel,
} from "@mui/material";
import {
  DateRangePicker,
  DateRangePickerDay,
  LocalizationProvider,
} from "@mui/x-date-pickers-pro";
import { itIT, enUS } from "@mui/x-date-pickers/locales";
import "dayjs/locale/en";
import "dayjs/locale/it";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Locale } from "@/i18n-config";
import SvgImageViewer from "../styles/Icons/SvgImageViewer";

interface EditableFieldProps {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: string | boolean | any;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
  name: string;
  variant?: Partial<TypographyProps>["variant"];
  visible?: boolean;
  type?: "text" | "number" | "boolean" | "image" | "date";
  multiline?: boolean;
  lang?: Locale;
}

export default function EditableField({
  label,
  value,
  onChange,
  isEditing,
  name,
  variant,
  visible = true,
  type = "text",
  multiline = false,
  lang = "en",
}: EditableFieldProps) {
  if (!visible) return null;

  const bool = type === "boolean" && typeof value === "boolean";
  const image = type === "image" && typeof value === "string";
  const date = type === "date";

  return (
    <div style={{ marginBottom: 6 }}>
      {!isEditing ? (
        <Typography variant={variant}>
          {bool ? (
            <>
              {label}: <Checkbox checked={value} disableRipple />
            </>
          ) : image ? (
            <SvgImageViewer
              svgString={value as string}
              svgName={label}
              className=""
              size={250}
              squared
            />
          ) : date ? (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateRangePicker
                readOnly
                defaultValue={[dayjs(value.start), dayjs(value.end)]}
              />
            </LocalizationProvider>
          ) : (
            `${label}: ${value}`
          )}
        </Typography>
      ) : bool ? (
        <FormControlLabel
          control={<Checkbox checked={value} onChange={onChange} name={name} />}
          label={label + ":"}
          labelPlacement="start"
        />
      ) : date ? (
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          localeText={
            (lang === "it" ? itIT : enUS).components.MuiLocalizationProvider
              .defaultProps.localeText
          }
          adapterLocale={lang}
        >
          <DateRangePicker
            calendars={1}
            value={[dayjs(value.start), dayjs(value.end)]}
            slots={{ day: DateRangePickerDay }}
            disablePast
            localeText={
              (lang === "it" ? itIT : enUS).components.MuiLocalizationProvider
                .defaultProps.localeText
            }
          />
        </LocalizationProvider>
      ) : (
        <TextField
          key={`${label.toLowerCase().replaceAll(" ", "-")}-field`}
          label={label}
          value={value}
          onChange={onChange}
          fullWidth
          margin="normal"
          name={name}
          multiline={multiline}
          maxRows={5}
          type={bool ? "checkbox" : date ? "date" : type}
          variant="outlined"
        />
      )}
    </div>
  );
}
