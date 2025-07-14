/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import { FormField } from './useDynamicForm';

export type FormSchemaFields = {
    [key: string]: z.ZodType<any, any, any>;
};

export function createFormSchema(fields: FormSchemaFields) {
    const schemaShape: { [key: string]: z.ZodType<any> } = {};

    for (const [key, schema] of Object.entries(fields))
        schemaShape[key] = schema;

    return z.object(schemaShape);
}

export const FormSchema = z.array(z.object({} as FormSchemaFields));
export type FormSchema = z.infer<typeof FormSchema>;

/*
export type FormState<T extends z.ZodType<any, any, any>> = T extends z.ZodObject<infer Shape>
    ? {
        errors: {
            [K in keyof Shape]?: string[];
        };
        message?: string;
    } | undefined
    : undefined;
*/

export type FormState<T extends Record<string, any>> = {
    errors?: {
        [K in keyof T]?: string[];
    };
    message?: string;
};

export function extractFormData(
    data: Record<string, any>,
    fields: FormField[],
) {
    const formData = new FormData();

    // Gestiamo i dati in base ai tipi definiti in fields
    fields.forEach((field) => {
        const value = data[field.name];

        if (value !== undefined) {
            // A seconda del tipo del campo, trattiamo i dati in modo appropriato
            switch (field.type) {
                case "number":
                    formData.append(field.name, value);
                    break;
                case "checkbox":
                    formData.append(field.name, value ? "true" : "false");
                    break;
                case "text":
                case "email":
                case "password":
                    formData.append(field.name, value.toString());
                    break;
                default:
                    formData.append(field.name, value.toString());
                    break;
            }
        }
    });

    return formData;
}

export function mapFormFieldsToFormState<T extends Record<string, any>>(fields: FormField[]): FormState<T> {
    const formState: FormState<T> = {
        errors: {},
        message: ""
    };

    fields.forEach(field => {
        if (field.required) formState.errors![field.name as keyof T] = [`${field.label} is required`];
    });

    return formState;
}
