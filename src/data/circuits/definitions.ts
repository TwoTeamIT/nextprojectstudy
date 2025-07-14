import { FormState } from '@/components/FormsGenerator/definitions';
import { FormField } from '@/components/FormsGenerator/useDynamicForm';
import { z } from 'zod';

export const Circuit = z.object({
    idC: z.number({
        required_error: "IdC is required",
        invalid_type_error: "IdC must be a not negative finite number",
    })
        .int()
        .nonnegative()
        .finite(),
    name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string"
    })
        .min(2, { message: "Name must be at least 2 characters long." })
        .trim(),
    place: z.string({
        required_error: "Place is required",
        invalid_type_error: "Place must be a string"
    })
        .min(2, { message: "Place must be at least 2 characters long." })
        .trim(),
    state: z.string({
        required_error: "State is required",
        invalid_type_error: "State must be a string"
    })
        .min(2, { message: "State must be at least 2 characters long." })
        .trim(),
    circuitImage: z.string({
        required_error: "Circuit Image is required",
        invalid_type_error: "Circuit Image must be a string"
    })
        .min(2, { message: "Circuit Image must be at least 2 characters long." })
        .trim(),
    active: z.boolean({
        required_error: "Active flag is required",
        invalid_type_error: "Active flag must be a boolean"
    })
        .default(false),
});


export type Circuit = z.infer<typeof Circuit>;


//questi sono i form field: vanno generati qui per aggregazione di tipo (appartengono entrambi all'oggetto circuit)
export const CircuitFormFields: FormField[] = [
    {
        name: "idC",
        label: "Circuit ID",
        type: "number",
        required: true,
        default: 0,
        ignored: true,
    },
    {
        name: "name",
        label: "Circuit Name",
        type: "text",
        required: true,
    },
    {
        name: "place",
        label: "Place",
        type: "text",
        required: true,
    },
    {
        name: "state",
        label: "State",
        type: "text",
        required: true,
    },
    {
        name: "circuitImage",
        label: "Circuit Image URL",
        type: "text",
        required: false,
    },
    {
        name: "active",
        label: "Active",
        type: "checkbox",
        required: true,
        default: true,
    },
]

//tutte le proprietà che NON HO MESSO AD IGNORED = TRUE
export type CircuitFormFields = { "name": string, "place": string, "state": string, "circuitImage": string, "active": boolean };

//export dei firlds per il form generator
export type CircuitFormState = FormState<CircuitFormFields>;
