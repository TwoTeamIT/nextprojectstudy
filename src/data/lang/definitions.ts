import { Locale } from '@/i18n-config';

export type SessionPayload = {
    lang: Locale;
    expiresAt: Date;
};