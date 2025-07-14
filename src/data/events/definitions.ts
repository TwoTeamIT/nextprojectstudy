import { z } from 'zod';

export const Event = z.object({
    idE: z.number({
        required_error: "idE is required",
        invalid_type_error: "idE must be a not negative finite number",
    })
        .int()
        .nonnegative()
        .finite(),
    idC: z.number({
            required_error: "IdC is required",
            invalid_type_error: "IdC must be a not negative finite number",
        })
            .int()
            .nonnegative()
            .finite(),
    grandPrixName: z.string({
        required_error: "grandPrixName is required",
        invalid_type_error: "grandPrixName must be a string"
    })
        .min(2, { message: "grandPrixName must be at least 2 characters long." })
        .trim(),
    startDate: z.date({
            required_error: "startDate is required",
            invalid_type_error: "startDate must be a string"
        })
            .min(new Date(), { message: "startDate must be a date in the future." }),
    endDate: z.date({
            required_error: "endDate is required",
            invalid_type_error: "endDate must be a string"
        })
        .min(new Date(), { message: "startDate must be a date in the future." }),
    active: z.boolean({
            required_error: "Active flag is required",
            invalid_type_error: "Active flag must be a boolean"
        })
            .default(false),
    idCh: z.number({
            required_error: "idCh is required",
            invalid_type_error: "idCh must be a not negative finite number",
        })
            .int()
            .nonnegative()
            .finite(),
    });

    export type Event = z.infer<typeof Event>;