import * as forge from 'node-forge';
import { PUBLIC_RSA_KEY } from '@/configs';

export const encryptData = (data: string): string => {
    const publicKey = forge.pki.publicKeyFromPem(PUBLIC_RSA_KEY);

    const dataBytes = forge.util.createBuffer(data, 'utf8');

    const encrypted = publicKey.encrypt(dataBytes.bytes(), 'RSA-OAEP', {
        md: forge.md.sha256.create(),
        mgf1: forge.mgf.mgf1.create(forge.md.sha1.create())
    });
    return forge.util.encode64(encrypted);
};