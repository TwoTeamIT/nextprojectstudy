import { FormState } from '@/components/FormsGenerator/definitions';
import { FormField } from '@/components/FormsGenerator/useDynamicForm';
import { z } from 'zod';

export const UserLogin = z.object({
    id: z.number({
        required_error: "Id is required",
        invalid_type_error: "Id must be a non-negative finite number",
    })
        .int()
        .nonnegative()
        .finite(),
    userName: z.string({
        required_error: "UserName is required",
        invalid_type_error: "UserName must be a string",
    })
        .min(2, { message: "UserName must be at least 2 characters long." })
        .trim(),
    userPwd: z.string({
        required_error: "UserPwd is required",
        invalid_type_error: "UserPwd must be a string",
    })
        .min(6, { message: "UserPwd must be at least 6 characters long." })
        .trim(),
    enabled: z.boolean({
        required_error: "Enabled is required",
        invalid_type_error: "Enabled must be a boolean",
    }),
    userType: z.number({
        required_error: "UserType is required",
        invalid_type_error: "UserType must be a number",
    })
        .int()
        .positive()
        .min(1, { message: "UserType must be a positive integer." }),
    firstName: z.string({
        required_error: "FirstName is required",
        invalid_type_error: "FirstName must be a string",
    })
        .min(2, { message: "FirstName must be at least 2 characters long." })
        .trim(),
    lastName: z.string({
        required_error: "LastName is required",
        invalid_type_error: "LastName must be a string",
    })
        .min(2, { message: "LastName must be at least 2 characters long." })
        .trim(),
    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a valid email string",
    })
        .email({ message: "Invalid email format." }),
    resetPassword: z.boolean({
        required_error: "ResetPassword is required",
        invalid_type_error: "ResetPassword must be a boolean",
    })
});

export type UserLogin = z.infer<typeof UserLogin>;

export const UserLoginFormFields: FormField[] = [
    {
        name: "id",
        label: "ID",
        type: "number",
        required: true,
        ignored: true,
        default: 0,
    },
    {
        name: "userName",
        label: "User Name",
        type: "text",
        required: true,
    },
    {
        name: "userPwd",
        label: "Password",
        type: "password",
        required: true,
    },

    {
        name: "userType",
        label: "User Type",
        type: "number",
        required: true,
        ignored: true,
    },
    {
        name: "firstName",
        label: "First Name",
        type: "text",
        required: true,
    },
    {
        name: "lastName",
        label: "Last Name",
        type: "text",
        required: true,
    },
    {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
    },
    {
        name: "enabled",
        label: "Enabled",
        type: "checkbox",
        required: true,
        default: true
    },
    {
        name: "resetPassword",
        label: "Reset Password",
        type: "checkbox",
        required: true,
        default: true
    },

];

export type UserLoginFormFields = {
    id: number;
    userName: string;
    userPwd: string;
    enabled: boolean;
    userType: number;
    firstName: string;
    lastName: string;
    email: string;
    resetPassword: boolean;
};

export type UserLoginFormState = FormState<UserLoginFormFields>;

////////////////////////////////////////////

export const PasswordUpdate = z.object({
    oldPassword: z.string({
        required_error: "Old Password is required",
        invalid_type_error: "Old Password must be a string",
    })
        .min(4, { message: "Old Password must be at least 6 characters long." })
        .trim(),
    newPassword: z.string({
        required_error: "New Password is required",
        invalid_type_error: "New Password must be a string",
    })
        .min(6, { message: "New Password must be at least 6 characters long." })
        .trim(),
    confirmPassword: z.string({
        required_error: "Confirm Password is required",
        invalid_type_error: "Confirm Password must be a string",
    })
        .min(6, { message: "Confirm Password must be at least 6 characters long." })
        .trim(),
});

export type PasswordUpdate = z.infer<typeof PasswordUpdate>;

export const ResetPasswordFormFields: FormField[] = [
    {
        name: "oldPassword",
        label: "Old Password",
        type: "password",
        required: true,
    },
    {
        name: "newPassword",
        label: "New Password",
        type: "password",
        required: true,
    },
    {
        name: "confirmPassword",
        label: "Confirm Password",
        type: "password",
        required: true,
    }
];

export type ResetPasswordFormFields = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

export type ResetPasswordFormState = FormState<ResetPasswordFormFields>;

////////////////////////////////////////////

export const SendResetLink = z.object({
    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a valid email string",
    })
        .email({ message: "Invalid email format." }),
});

export type SendResetLink = z.infer<typeof SendResetLink>;

export const SendResetLinkFormFields: FormField[] = [
    {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
    },
];

export type SendResetLinkFormFields = {
    email: string;
};

export type SendResetLinkFormState = FormState<SendResetLinkFormFields>;

////////////////////////////////////////////

export const ResetToken = z.object({
    token: z.string({
        required_error: "Token is required",
    }),
    temporaryPassword: z.string({
        required_error: "Temporary Password is required",
    }),
    emailUser: z.string({
        required_error: "Email User is required",
    })
        .email({ message: "Invalid email format." }),
    expiration: z.string(
        {
            required_error: "Expiration is required",
            invalid_type_error: "Expiration must be a valid datetime",
        }
    )
        .datetime({ offset: true }),
});

export type ResetToken = z.infer<typeof ResetToken>;

////////////////////////////////////////////

export const ForgottenPasswordUpdate = z.object({
    resetToken: z.string({
        required_error: "Reset Token is required",
    }),
    temporaryPassword: z.string({
        required_error: "Temporary Password is required",
        invalid_type_error: "Temporary Password must be a string",
    })
        .min(6, { message: "Temporary Password must be at least 6 characters long." })
        .trim(),
    newPassword: z.string({
        required_error: "New Password is required",
        invalid_type_error: "New Password must be a string",
    })
        .min(6, { message: "New Password must be at least 6 characters long." })
        .trim(),
    confirmPassword: z.string({
        required_error: "Confirm Password is required",
        invalid_type_error: "Confirm Password must be a string",
    })
        .min(6, { message: "Confirm Password must be at least 6 characters long." })
        .trim(),
});

export type ForgottenPasswordUpdate = z.infer<typeof ForgottenPasswordUpdate>;

export const ResetForgottenPasswordFormFields: FormField[] = [
    {
        name: "resetToken",
        label: "Reset Token",
        type: "text",
        required: true,
        ignored: true
    },
    {
        name: "temporaryPassword",
        label: "Temporary Password",
        type: "password",
        required: true,
    },
    {
        name: "newPassword",
        label: "New Password",
        type: "password",
        required: true,
    },
    {
        name: "confirmPassword",
        label: "Confirm Password",
        type: "password",
        required: true,
    }
];

export type ResetForgottenPasswordFormFields = {
    resetToken: string;
    temporaryPassword: string;
    newPassword: string;
    confirmPassword: string;
};

export type ResetForgottenPasswordFormState = FormState<ResetForgottenPasswordFormFields>;
