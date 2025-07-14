import { DEBUG } from "@/configs";
import { ToastOptions } from "./Toaster";

class ToastObserver {
    private static instance: ToastObserver;
    private observers: ((toast: ToastOptions) => void)[] = [];

    private constructor() {
        if (DEBUG) console.log("ToastObserver Singleton creato");
    }

    static getInstance(): ToastObserver {
        if (!ToastObserver.instance) ToastObserver.instance = new ToastObserver();
        return ToastObserver.instance;
    }

    subscribe(observer: (toast: ToastOptions) => void) {
        if (DEBUG) console.log("Nuovo observer aggiunto");
        this.observers.push(observer);
    }

    unsubscribe(observer: (toast: ToastOptions) => void) {
        this.observers = this.observers.filter((obs) => obs !== observer);
        if (DEBUG) console.log("Observer rimosso");
    }

    notify(toast: ToastOptions) {
        if (DEBUG) console.log(`Notifica inviata a ${this.observers.length} observers`, toast);
        this.observers.forEach((observer) => observer(toast));
    }
}

// Esporta l'istanza unica
export default ToastObserver.getInstance();
