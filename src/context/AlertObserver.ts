import { DEBUG } from "@/configs"
import { AlertOptions } from "./Alerter";

class AlertObserver {
    private static instance: AlertObserver;
    private observers: ((alert: AlertOptions) => void)[] = [];

    private constructor() {
        // Il costruttore è privato per evitare istanziazioni dirette
        if (DEBUG) console.log("AlertObserver Singleton creato");
    }

    static getInstance(): AlertObserver {
        if (!AlertObserver.instance) AlertObserver.instance = new AlertObserver();

        return AlertObserver.instance;
    }

    subscribe(observer: (alert: AlertOptions) => void) {
        if (DEBUG) console.log("Nuovo observer aggiunto");
        this.observers.push(observer);
    }

    unsubscribe(observer: (alert: AlertOptions) => void) {
        this.observers = this.observers.filter((obs) => obs !== observer);
        if (DEBUG) console.log("Observer rimosso");
    }

    notify(alert: AlertOptions) {
        if (DEBUG) console.log(`Notifica inviata a ${this.observers.length} observers`, alert);
        this.observers.forEach((observer) => observer(alert));
    }
}

// Export istanza unica
export default AlertObserver.getInstance();
