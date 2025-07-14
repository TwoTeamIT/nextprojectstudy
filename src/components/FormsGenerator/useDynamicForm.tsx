import React, { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  extractFormData,
  FormState,
  mapFormFieldsToFormState,
} from "@/components/FormsGenerator/definitions";
import FormButton from "./FormButton/FormButton";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { Locale } from "@/i18n-config";
import { itIT, enUS } from "@mui/x-date-pickers/locales";
import "dayjs/locale/en";
import "dayjs/locale/it";

export type FormField = {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "number" | "checkbox" | "date";
  required?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default?: any;
  ignored?: boolean;
};

export type ValidationFunction = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: Record<string, any>
) => Record<string, string>;

export type UseDynamicFormProps = {
  fields: FormField[];
  submitAction: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    state: FormState<any> | undefined,
    formData: FormData
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<FormState<any> | undefined>;
  callback?: "refresh" | "goback" | undefined;
  cancelCallback?: "goback" | undefined;
  submittingLabel: string;
  submitLabel: string;
  cancelLabel?: string;
  outcastButtons?: boolean;
  validations?: ValidationFunction[];
  lang?: Locale;
};

export function useDynamicForm({
  fields,
  submitAction,
  callback,
  cancelCallback,
  submittingLabel,
  submitLabel,
  cancelLabel,
  outcastButtons = false,
  validations = [],
  lang = "en",
}: UseDynamicFormProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const { pending } = useFormStatus();
  const [state, action] = useActionState(
    submitAction,
    mapFormFieldsToFormState(fields)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (type === "checkbox")
      setFormData((prevData) => ({
        ...prevData,
        [name]: !prevData[name],
      }));
    else
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateDate = (fieldName: string, value: Date) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handlePasswordToggle = (name: string) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    validations.forEach((validate) => {
      Object.assign(newErrors, validate(formData));
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formDataObject = extractFormData(formData, fields);
      const res = await submitAction(state, formDataObject);

      if (res?.errors) {
        setErrors(
          Object.fromEntries(
            Object.entries(res.errors).map(([key, value]) => [
              key,
              Array.isArray(value) ? value[0] : (value as unknown as string),
            ])
          )
        );
        return;
      }

      if (callback) {
        switch (callback) {
          case "refresh":
            router.refresh();
            break;
          case "goback":
            router.back();
            break;
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : err instanceof String
          ? err.toString()
          : "An Error Occurred";
      setErrors({ general: errorMessage });
    }
  };

  const handleCancel = () => {
    setFormData({});
    if (!cancelCallback) return;
    router.back();
  };

  useEffect(() => {
    fields.map(
      (field) =>
        field.default !== undefined &&
        field.default !== null &&
        setFormData((prevData) => ({
          ...prevData,
          [field.name]: field.default as number | string,
        }))
    );
  }, [fields]);

  const renderFields = () => {
    return fields.map((field) => {
      if (field.ignored) return;
      const isPassword = field.type === "password";
      const isCheckbox = field.type === "checkbox";
      const isDate = field.type === "date";

      return (
        <Box
          key={field.name}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            width: isCheckbox ? "fit-content" : "100%",
            position: "relative",
          }}
        >
          {/* Se il campo è di tipo checkbox */}
          {isCheckbox ? (
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData[field.name] || false}
                  onChange={handleInputChange}
                  name={field.name}
                  color="primary"
                />
              }
              label={`${field.label} ${field.required && "*"}`}
              labelPlacement="start"
            />
          ) : isDate ? (
            <div className="mt-2 w-full">
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                localeText={
                  (lang === "it" ? itIT : enUS).components
                    .MuiLocalizationProvider.defaultProps.localeText
                }
                adapterLocale={lang}
              >
                <DatePicker
                  label={field.label}
                  name={field.name}
                  value={dayjs(formData[field.name])}
                  disablePast
                  className="w-full"
                  onChange={(date) => {
                    if (!date) return;
                    handleUpdateDate(field.name, date.toDate());
                  }}
                  localeText={
                    (lang === "it" ? itIT : enUS).components
                      .MuiLocalizationProvider.defaultProps.localeText
                  }
                />
              </LocalizationProvider>
            </div>
          ) : (
            // Se il campo non è un checkbox (text, email, password, number)
            <TextField
              autoComplete="off"
              id={field.name}
              name={field.name}
              label={field.label}
              type={
                isPassword
                  ? !showPassword[field.name]
                    ? "password"
                    : "text"
                  : field.type
              }
              value={formData[field.name] || ""}
              onChange={handleInputChange}
              fullWidth
              variant="standard"
              required={field.required}
              slotProps={{
                input: {
                  endAdornment: field.type === "password" && (
                    <IconButton
                      onClick={() => handlePasswordToggle(field.name)}
                    >
                      {showPassword[field.name] ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  ),
                },
              }}
            />
          )}

          {/* Mostra errori di validazione specifici per il campo */}
          {errors[field.name] && (
            <Typography variant="subtitle2" color="error">
              {errors[field.name]}
            </Typography>
          )}
        </Box>
      );
    });
  };

  return {
    formState: { formData, errors, state, pending },
    formRender: (
      <form action={action} autoComplete="off" onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            width: "100%",
          }}
        >
          {renderFields()}
          {!outcastButtons && (
            <Box
              className="border-t pt-4"
              sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}
            >
              {cancelLabel && (
                <Button variant="outlined" onClick={handleCancel}>
                  {cancelLabel}
                </Button>
              )}
              <FormButton
                label={submitLabel}
                submittingLabel={submittingLabel}
              />
            </Box>
          )}
        </Box>
      </form>
    ),
    formButtons: (
      <>
        {outcastButtons && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginTop: 1,
            }}
          >
            {cancelLabel && (
              <Button variant="outlined" onClick={handleCancel}>
                {cancelLabel}
              </Button>
            )}
            <Button variant="contained" onClick={handleSubmit}>
              {pending ? submittingLabel : submitLabel}
            </Button>
          </Box>
        )}
      </>
    ),
  };
}
