/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  useDynamicForm,
  UseDynamicFormProps,
} from "@/components/FormsGenerator/useDynamicForm";

export default function GenerateForm({
  fields,
  submitAction,
  submittingLabel,
  submitLabel: buttonLabel,
  cancelLabel,
}: UseDynamicFormProps) {
  const { formState, formRender } = useDynamicForm({
    fields: fields,
    submitAction: submitAction,
    submittingLabel: submittingLabel,
    submitLabel: buttonLabel,
    cancelLabel: cancelLabel,
  });

  return <>{formRender}</>;
}
