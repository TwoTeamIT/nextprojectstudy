"use client";

import {
  useDynamicForm,
  ValidationFunction,
} from "@/components/FormsGenerator/useDynamicForm";
import { ResetPasswordFormFields } from "@/data/user/definitions";
import { resetPassword } from "@/data/user/user";

type ResetPasswordFormProps = {
  submitLabel: string;
  submittingLabel: string;
  cancelLabel: string;
  passwordMismatchError: string;
  passwordTooShortError: string;
};

export function ResetPasswordForm({
  submitLabel,
  submittingLabel,
  cancelLabel,
  passwordMismatchError,
  passwordTooShortError,
}: ResetPasswordFormProps) {
  const validateMatchingFields: ValidationFunction = (formData) => {
    const errors: Record<string, string> = {};

    if (formData["newPassword"].length < 6) {
      errors["newPassword"] = passwordTooShortError;
      return errors;
    }

    if (formData["newPassword"] !== formData["confirmPassword"])
      errors["confirmPassword"] = passwordMismatchError;

    return errors;
  };

  const { formRender } = useDynamicForm({
    fields: ResetPasswordFormFields,
    cancelLabel: cancelLabel,
    submitLabel: submitLabel,
    submittingLabel: submittingLabel,
    submitAction: resetPassword,
    callback: "refresh",
    cancelCallback: "goback",
    validations: [validateMatchingFields],
  });

  return (
    <div className="flex flex-col w-full md:w-1/2 gap-8 mx-auto">
      {formRender}
    </div>
  );
}
