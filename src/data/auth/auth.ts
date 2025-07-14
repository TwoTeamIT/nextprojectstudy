'use server';

import { AuthUser, LoggedUser, LoginFormSchema, LoginFormState } from './definitions';
import { createSession, deleteSession, getSession } from './stateless-session';
import { encryptData } from '@/lib/encryptData';
import { setFetchOptions } from '@/lib/formatFetchOptions';
import { redirect } from 'next/navigation';
import { safeApiCall } from '@/lib/errorHandler';
import api from '@/lib/apiCaller';

type AuthRes = {
    user: LoggedUser,
    accessToken: string,
    refreshToken: string,
    accessTokenExpiry: string,
    refreshTokenExpiry: string,
}

export async function login(
    state: LoginFormState | undefined,
    formData: FormData,
): Promise<LoginFormState | undefined> {
    const validatedFields = LoginFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) return { errors: validatedFields.error.flatten().fieldErrors };

    // 2. Query the database for the user with the given email
    let user: AuthUser | undefined;

    const { email, password } = validatedFields.data;

    const options = setFetchOptions({ method: "POST", body: JSON.stringify({ username: email, password: encryptData(password) }) });
    const [err, status, msg, res] = await safeApiCall<AuthRes>(api.anonymousFetch(`/authentication/login`, options))
    if (err || msg || status !== 200)
        return {
            message: JSON.stringify({
                title: `${status}: ${err}`,
                message: msg,
                severity: "error",
            })
        };

    if (res) user = {
        ...res.user,
        accessToken: {
            token: res.accessToken,
            expiryDate: res.accessTokenExpiry,
        },
        refreshToken: {
            token: res.refreshToken,
            expiryDate: res.refreshTokenExpiry,
        }
    };

    if (!user) return {
        message: JSON.stringify({
            title: `Login Error`,
            message: 'Invalid login credentials.',
            severity: "error",
        })
    };

    // 4. If login successful, create a session for the user and redirect
    await createSession(user, user.refreshToken.expiryDate).finally(() => {
        redirect('/dashboard');
    });

    return state;
}

export async function logout() {
    // Call the API Logout method
    await deleteSession().finally(() => { redirect('/'); });;
}

export async function getMyDetails(): Promise<LoggedUser | undefined> {
    const session = await getSession();
    if (!session || !session.user) return undefined;

    const loggedUser: LoggedUser = {
        id: session.user.id,
        userName: session.user.userName,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        email: session.user.email,
        resetPassword: session.user.resetPassword
    };

    return loggedUser;
}