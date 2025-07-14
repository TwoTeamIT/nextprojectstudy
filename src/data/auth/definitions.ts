import { z } from 'zod';
import { FormState } from '@/components/FormsGenerator/definitions';
import { FormField } from '@/components/FormsGenerator/useDynamicForm';

export const JWTToken = z.object({
    token: z.string(
        {
            required_error: "Token is required",
            invalid_type_error: "Token must be a valid JWT token",
        }
    ),
    expiryDate: z.string(
        {
            required_error: "Expiry Date is required",
            invalid_type_error: "Expiry Date must be a valid datetime",
        }
    )
        .datetime({ offset: true }),
});

export type JWTToken = z.infer<typeof JWTToken>;

export const LoggedUser = z.object({
    id: z.number(
        {
            required_error: "Id is required",
            invalid_type_error: "Id must be a not negative finite number",
        }
    )
        .int()
        .nonnegative()
        .finite(),
    userName: z.string(
        {
            required_error: "UserName is required",
            invalid_type_error: "UserName must be a string",
        }
    )
        .min(2, { message: 'UserName must be at least 2 characters long.' })
        .trim(),
    firstName: z.string(
        {
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
        }
    )
        .min(2, { message: 'Name must be at least 2 characters long.' })
        .trim(),
    lastName: z.string(
        {
            required_error: "Surname is required",
            invalid_type_error: "Surname must be a string",
        }
    )
        .min(2, { message: 'Surname must be at least 2 characters long.' })
        .trim(),
    email: z.string(
        {
            required_error: "Email is required",
            invalid_type_error: "Email must be a valid email address",
        }
    )
        .email({ message: 'Please enter a valid email.' })
        .trim(),
    resetPassword: z.boolean().default(false).optional()
});

export type LoggedUser = z.infer<typeof LoggedUser>;

export const AuthUser = LoggedUser.merge(
    z.object({
        accessToken: JWTToken,
        refreshToken: JWTToken,
    })
);

export type AuthUser = z.infer<typeof AuthUser>;

export const LoginFormSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z.string().min(1, { message: 'Password field must not be empty.' }),
});

export const LoginFormFields: FormField[] = [
    {
        name: "email",
        label: "email",
        type: "email",
        required: true,
    },
    {
        name: "password",
        label: "password",
        type: "password",
        required: true,
    }
];

export type LoginFormFields = {
    email: string;
    password: string;
};

export type LoginFormState = FormState<LoginFormFields>;

export type SessionPayload = {
    user: AuthUser;
    expiresAt: Date;
};
