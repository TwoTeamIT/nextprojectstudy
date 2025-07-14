import localFont from "next/font/local";

export const fontBd = localFont({
    src: "../assets/fonts/UniNeueBold.woff",
    variable: "--font-bold",
    preload: true,
    display: 'swap'
});

export const fontRg = localFont({
    src: "../assets/fonts/UniNeueRegular.woff",
    variable: "--font-regular",
    preload: true,
    display: 'swap'
});

export const fontButton = localFont({
    src: "../assets/fonts/UniNeueBook.woff",
    variable: "--font-button",
    preload: true,
    display: 'swap'
});

export const fontBdIt = localFont({
    src: "../assets/fonts/UniNeueBold-Italic.woff",
    variable: "--font-bold-it",
    preload: true,
    display: 'swap'
});

export const fontExtBd = localFont({
    src: "../assets/fonts/UniNeueHeavy.woff",
    variable: "--font-extra-bold",
    preload: true,
    display: 'swap'
});
