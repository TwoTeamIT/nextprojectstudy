"use client";

import {
  FormField,
  useDynamicForm,
  ValidationFunction,
} from "@/components/FormsGenerator/useDynamicForm";
import { ResetForgottenPasswordFormFields } from "@/data/user/definitions";
import { resetForgottenPassword } from "@/data/user/user";
import { Card, CardActions, CardContent, CardHeader } from "@mui/material";

type ResetForgottenPasswordFormProps = {
  title: string;
  submitLabel: string;
  submittingLabel: string;
  cancelLabel: string;
  passwordMismatchError: string;
  resetToken: string;
};

export function ResetForgottenPasswordForm({
  title,
  submitLabel,
  submittingLabel,
  cancelLabel,
  passwordMismatchError,
  resetToken,
}: ResetForgottenPasswordFormProps) {
  const validateMatchingFields: ValidationFunction = (formData) => {
    const errors: Record<string, string> = {};
    if (formData["newPassword"] !== formData["confirmPassword"])
      errors["confirmPassword"] = passwordMismatchError;

    return errors;
  };

  const formFields: FormField[] = ResetForgottenPasswordFormFields;
  formFields.find((f) => f.name === "resetToken")!.default = resetToken;

  const { formButtons, formRender } = useDynamicForm({
    fields: ResetForgottenPasswordFormFields,
    cancelLabel: cancelLabel,
    submitLabel: submitLabel,
    submittingLabel: submittingLabel,
    submitAction: resetForgottenPassword,
    //callback: "goback",
    cancelCallback: "goback",
    validations: [validateMatchingFields],
    outcastButtons: true,
  });

  return (
    <Card
      key={`forgot-password-card`}
      elevation={3}
      className="py-2 px-3 w-full h-full"
    >
      <CardHeader title={title} className="border-b" />
      <CardContent>
        <div className="flex flex-col w-[80%] gap-8 mx-auto">{formRender}</div>
      </CardContent>
      <CardActions className="border-t mt-5">{formButtons}</CardActions>
    </Card>
  );
}
