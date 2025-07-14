import { z } from 'zod';

export const Audit = z.object({
    id: z.number({
        required_error: "Id is required",
        invalid_type_error: "Id must be a not negative finite number",
    })
        .int()
        .nonnegative()
        .finite(),
    timeStampUTC: z.string({
        required_error: "Timestamp is required",
        invalid_type_error: "Timestamp must be a string",
    })
        .min(2, { message: "Timestamp must be at least 2 characters long." })
        .trim(),
    auditFilterEvent: z.string({
        required_error: "Audit Filter Event is required",
        invalid_type_error: "Audit Filter Event must be a string",
    })
        .min(2, { message: "Audit Filter Event must be at least 2 characters long." })
        .trim(),
    controller: z.string({
        required_error: "Controller is required",
        invalid_type_error: "Controller must be a string",
    })
        .min(2, { message: "Controller must be at least 2 characters long." })
        .trim(),
    action: z.string({
        required_error: "Action is required",
        invalid_type_error: "Action must be a string",
    })
        .min(2, { message: "Action must be at least 2 characters long." })
        .trim(),
    userIdentity: z.string({
        required_error: "User Identity is required",
        invalid_type_error: "User Identity must be a string",
    })
        .min(2, { message: "User Identity must be at least 2 characters long." })
        .trim(),
    requestHeaders: z.string({
        required_error: "Request Headers are required",
        invalid_type_error: "Request Headers must be a valid format",
    })
        .trim(),
    requestConnection: z.string({
        required_error: "Request Connection is required",
        invalid_type_error: "Request Connection must be a valid format",
    })
        .trim(),
    requestPayload: z.string({
        required_error: "Request Payload is required",
        invalid_type_error: "Request Payload must be a valid format",
    })
        .trim(),
    responseStatus: z.number({
        required_error: "Response Status is required",
        invalid_type_error: "Response Status must be a number",
    }),
    responseResult: z.string({
        required_error: "Response Result is required",
        invalid_type_error: "Response Result must be a valid format",
    })
        .trim(),
    responseMessage: z.string({
        required_error: "Response Message is required",
        invalid_type_error: "Response Message must be a string",
    })
        .min(2, { message: "Response Message must be at least 2 characters long." })
        .trim(),
});

export type Audit = z.infer<typeof Audit>;
