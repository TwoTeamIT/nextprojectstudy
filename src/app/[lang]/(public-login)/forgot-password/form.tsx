"use client";

import { useDynamicForm } from "@/components/FormsGenerator/useDynamicForm";
import { SendResetLinkFormFields } from "@/data/user/definitions";
import { sendResetLink } from "@/data/user/user";
import { Card, CardActions, CardContent, CardHeader } from "@mui/material";

type SendResetLinkFormProps = {
  title: string;
  submitLabel: string;
  submittingLabel: string;
  cancelLabel: string;
};

export function SendResetLinkForm({
  title,
  submitLabel,
  submittingLabel,
  cancelLabel,
}: SendResetLinkFormProps) {
  const { formButtons, formRender } = useDynamicForm({
    fields: SendResetLinkFormFields,
    cancelLabel: cancelLabel,
    submitLabel: submitLabel,
    submittingLabel: submittingLabel,
    submitAction: sendResetLink,
    //callback: "goback",
    cancelCallback: "goback",
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
