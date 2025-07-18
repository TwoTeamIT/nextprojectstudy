"use server";

import api from "@/lib/apiCaller";
import {
    ForgottenPasswordUpdate, PasswordUpdate, ResetForgottenPasswordFormState, ResetPasswordFormState,
    ResetToken, SendResetLink, SendResetLinkFormState, UserLogin, UserLoginFormState,
    UserRowSchema, UserRowSchemaFormState
} from "./definitions";
import { createSession, getSession } from "../auth/stateless-session";
import { encryptData } from "@/lib/encryptData";
import { setFetchOptions } from "@/lib/formatFetchOptions";
import { safeApiCall } from "@/lib/errorHandler";
import { DEBUG } from "@/configs";
import { redirect, RedirectType } from "next/navigation";
import { getLanguageSession } from "../lang/stateless-session";
import { Locale } from "@/i18n-config";
import { ToastOptions } from "@/context/Toaster";
import it from "@/dictionaries/it.json";
import en from "@/dictionaries/en.json";
import { faker } from '@faker-js/faker';
import { z } from "zod";

export async function getAllDemoUsers(): Promise<UserRowSchemaFormState[]> {
    // Genera 100 righe fittizie
    const rows = Array.from({ length: 100 }, (_, id) => ({
        id,
        name: faker.person.fullName(),
        rating: faker.number.int({ min: 1, max: 5 }),
        country: faker.location.country(),
        dateCreated: faker.date.past().toISOString(),
        isAdmin: faker.datatype.boolean(),
    }));


    // ✅ Corretto: validazione dell'array di oggetti
    const parseResult = z.array(UserRowSchema).safeParse(rows);

    if (!parseResult.success) {
        console.error("Invalid data format from useDemoData:", parseResult.error);
        return [];
    }

    return parseResult.data;
}
export async function saveUserLogin(
    state: UserLoginFormState | undefined,
    formData: FormData,
): Promise<UserLoginFormState | undefined> {
    const id = formData.get('id');

    if (id === undefined || id === null) return;

    const validatedFields = UserLogin.safeParse({
        id: parseInt(id.toString()),
        userName: formData.get('userName'),
        userPwd: formData.get('userPwd') || "000000",
        enabled: formData.get('enabled') === 'true',
        userType: 1,
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        resetPassword: formData.get('resetPassword') === 'true',
    });
    const errorMessage = { message: 'Invalid user provided.' };

    if (!validatedFields.success) return { errors: validatedFields.error.flatten().fieldErrors };

    const session = await getSession();
    if (!session) throw new Error(`No session data available`);

    const accessToken = session?.user.accessToken.token;

    const options = setFetchOptions({ method: "POST" });

    const newUserPwd = validatedFields.data.id !== 0 ? validatedFields.data.userPwd : encryptData(validatedFields.data.userPwd);
    const [err, status, msg, res] = await safeApiCall(api.post(accessToken, `/user`, options, { ...validatedFields.data, userPwd: newUserPwd }));
    if (err || msg || status !== 200) return errorMessage;
    if (DEBUG) console.log("User saved", res);

    return state;
}


export async function getUserById(id: UserLogin["id"]): Promise<UserLogin | undefined> {
    const options = setFetchOptions({ method: "GET" });

    const session = await getSession();
    if (!session) throw new Error(`No session data available`);

    const accessToken = session?.user.accessToken.token;

    const [err, status, msg, res] = await safeApiCall<UserLogin>(api.get(accessToken, `/user/${id}`, options))
    if (err || msg || status !== 200) return undefined;

    return res || undefined;
}

export async function resetPassword(
    state: ResetPasswordFormState | undefined,
    formData: FormData,
): Promise<ResetPasswordFormState | { message: string } | undefined> {
    const validatedFields = PasswordUpdate.safeParse({
        oldPassword: formData.get('oldPassword'),
        newPassword: formData.get('newPassword'),
        confirmPassword: formData.get('confirmPassword'),
    });
    const errorMessage = { message: 'Invalid password provided.' };

    if (!validatedFields.success) return { errors: validatedFields.error.flatten().fieldErrors };
    if (validatedFields.error) return errorMessage;

    const session = await getSession();
    if (!session) throw new Error(`No session data available`);

    const accessToken = session?.user.accessToken.token;

    const options = setFetchOptions({
        method: "PATCH",
        body: JSON.stringify({
            id: session.user.id,
            oldPassword: encryptData(validatedFields.data.oldPassword),
            newPassword: encryptData(validatedFields.data.newPassword),
            confirmPassword: encryptData(validatedFields.data.confirmPassword),
        })
    });

    const [err, status, msg, res] = await safeApiCall<UserLogin>(api.patch(accessToken, `user/`, options))
    if (err || msg || status !== 200 || !res)
        return {
            message: JSON.stringify({
                title: `${status}: ${err}`,
                message: msg,
                severity: "error",
            })
        };

    const newSession = await getSession();
    const langSession = await getLanguageSession();
    const lang: Locale = langSession?.lang ?? "en";
    const dictionaries = { it, en };
    if (newSession) await createSession({ ...newSession.user, ...{ resetPassword: false } }, newSession.expiresAt.toString());
    const toast: ToastOptions = {
        title: dictionaries[lang].Toasts.PasswordUpdated.Title,
        message: dictionaries[lang].Toasts.PasswordUpdated.Message,
        severity: "success",
        durationMs: 5000,
    };

    return { message: JSON.stringify({ toast }) };
}

export async function sendResetLink(
    state: SendResetLinkFormState | undefined,
    formData: FormData,
): Promise<SendResetLinkFormState | undefined> {
    const validatedFields = SendResetLink.safeParse({
        email: formData.get('email'),
    });
    const errorMessage = { message: 'Invalid password provided.' };

    if (!validatedFields.success) return { errors: validatedFields.error.flatten().fieldErrors };
    if (validatedFields.error) return errorMessage;

    const options = setFetchOptions({
        method: "POST",
        body: JSON.stringify({
            emailUser: validatedFields.data.email,
        })
    });

    const [err, status, msg, res] = await safeApiCall<ResetToken>(api.anonymousFetch(`user/forgot-password`, options))
    if (err || msg || status !== 200) return undefined;

    if (res) redirect(`/forgot-password/${res.token}`);

    return state;
}

export async function checkResetTokenValidity(token: string): Promise<{ success: boolean, error?: string | undefined }> {
    const options = setFetchOptions({ method: "GET" });

    const [err, status, msg, res] = await safeApiCall<ResetToken>(api.anonymousFetch(`user/forgot-password/${token}`, options))
    if ((err || msg || status !== 200) || !res) {
        return {
            success: false,
            error: JSON.stringify({
                title: "Reset token has expired",
                message:
                    `The URL You are visiting provides an invalid reset token: it could be expired. Try asking a new one!`,
                severity: "error",
            })
        }
    }

    return { success: true };
}

export async function resetForgottenPassword(
    state: ResetForgottenPasswordFormState | undefined,
    formData: FormData
): Promise<ResetForgottenPasswordFormState | undefined> {
    const validatedFields = ForgottenPasswordUpdate.safeParse({
        resetToken: formData.get('resetToken'),
        temporaryPassword: formData.get('temporaryPassword'),
        newPassword: formData.get('newPassword'),
        confirmPassword: formData.get('confirmPassword'),
    });
    const errorMessage = { message: 'Invalid password provided.' };

    if (!validatedFields.success) return { errors: validatedFields.error.flatten().fieldErrors };
    if (validatedFields.error) return errorMessage;

    const options = setFetchOptions({
        method: "PATCH",
        body: JSON.stringify({
            token: validatedFields.data.resetToken,
            temporaryPassword: encryptData(validatedFields.data.temporaryPassword),
            newPassword: encryptData(validatedFields.data.newPassword),
            confirmPassword: encryptData(validatedFields.data.confirmPassword),
        })
    });

    const [err, status, msg, res] = await safeApiCall<ResetToken>(api.anonymousFetch(`user/forgot-password`, options))
    if (err || msg || status !== 200) return undefined;
    if (DEBUG) console.log("Reset successful", res);

    redirect("/", RedirectType.replace);
    return state;
}