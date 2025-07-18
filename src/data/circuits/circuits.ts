import api from "@/lib/apiCaller";
import { safeApiCall } from "@/lib/errorHandler";
import { setFetchOptions } from "@/lib/formatFetchOptions";
import { Circuit, CircuitFormState } from "./definitions";
import { getSession } from "../auth/stateless-session";
import { DEBUG } from "@/configs";

//boolean = true è il default
export async function getCircuits(active: boolean = true): Promise<Circuit[]> {
    const options = setFetchOptions({ method: "GET" });

    const session = await getSession();
    if (!session) throw new Error(`No session data available`);

    const accessToken = session?.user.accessToken.token;

    const [err, status, msg, res] = await safeApiCall<Circuit[]>(api.get(accessToken, `/circuit/${active}`, options));
    if (err || msg || status !== 200) return [];

    return res || [];
}

export async function getAllCircuits(active: boolean = true): Promise<Circuit[]> {
    // Mock di 15 circuiti
    const circuits: Circuit[] = Array.from({ length: 6 }, (_, i) => ({
        idC: i + 1,
        name: `Card name ${i + 1}`,
        place: `Place name ${i + 1}`,
        state: `State  name ${i + 1}`,
        circuitImage: `<svg viewBox="0 0 64 64" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style> .cls-1 { fill: #e7ecef; } .cls-2 { fill: #8b8c89; } .cls-3 { fill: #bc6c25; } .cls-4 { fill: #a3cef1; } .cls-5 { fill: #dda15e; } .cls-6 { fill: #c7f9cc; } .cls-7 { fill: #6096ba; } .cls-8 { fill: #274c77; } </style></defs><path class="cls-5" d="M24.58,41.04l-3,1.29c-1.01,.43-2.15,.43-3.15,0l-3-1.29c-1.47-.63-2.42-2.08-2.42-3.68v-5.36c0-3.31,2.69-6,6-6h2c3.31,0,6,2.69,6,6v5.36c0,1.6-.95,3.05-2.42,3.68Z"></path><path class="cls-8" d="M33.14,47c-1.82-1.85-4.35-3-7.14-3h-3c0,1.66-1.34,3-3,3s-3-1.34-3-3h-3c-5.52,0-10,4.48-10,10v7H26l4-14h3.14Z"></path><path class="cls-5" d="M15,57h2c1.1,0,2,.9,2,2v2h-4v-4h0Z"></path><path class="cls-8" d="M10,33.73c-.29,.17-.64,.27-1,.27-1.1,0-2-.9-2-2s.9-2,2-2c.42,0,.81,.13,1.14,.36"></path><path class="cls-8" d="M30,33.73c.29,.17,.64,.27,1,.27,1.1,0,2-.9,2-2s-.9-2-2-2c-.42,0-.81,.13-1.14,.36"></path><path class="cls-3" d="M17,41.71l1.42,.61c1.01,.44,2.15,.44,3.16,0l1.42-.61v2.29c0,1.66-1.34,3-3,3s-3-1.34-3-3v-2.29Z"></path><polyline class="cls-2" points="26 61 30 47 52 47 48 61"></polyline><path class="cls-8" d="M26.4,29.38h-.01c-.57-.23-1.23-.38-2.06-.38-4.33,0-4.33,4-8.67,4-1.13,0-1.97-.27-2.66-.67v-.33c0-3.31,2.69-6,6-6h2c2.37,0,4.42,1.38,5.39,3.38h.01Z"></path><path class="cls-1" d="M27,36.6v-4.6c0-3.31-2.69-6-6-6h-2c-3.31,0-6,2.69-6,6v4h-2c-.55,0-1-.45-1-1v-3c0-5.52,4.48-10,10-10,2.76,0,5.26,1.12,7.07,2.93s2.93,4.31,2.93,7.07v3.18c0,.48-.34,.89-.8,.98l-2.2,.44Z"></path><path class="cls-4" d="M39,53c.55,0,1,.45,1,1s-.45,1-1,1v-2Z"></path><path class="cls-7" d="M20,38h0c-.11-.54,.24-1.07,.78-1.18l8.22-1.64v-2.86c0-4.79-3.61-8.98-8.38-9.3-5.24-.35-9.62,3.81-9.62,8.98v3h2v2h-2c-1.1,0-2-.9-2-2v-2.68c0-5.72,4.24-10.74,9.94-11.27,6.54-.62,12.06,4.53,12.06,10.95v3.18c0,.95-.67,1.77-1.61,1.96l-8.22,1.64c-.54,.11-1.07-.24-1.18-.78Z"></path><path class="cls-7" d="M20,61h-2v-2c0-.55-.45-1-1-1h-7c-.55,0-1-.45-1-1v-4c0-.27,.11-.52,.29-.71l1.29-1.29c.39-.39,1.02-.39,1.41,0h0c.39,.39,.39,1.02,0,1.41l-1,1v2.59h6c1.66,0,3,1.34,3,3v2Z"></path><rect class="cls-4" height="2" width="50" x="2" y="60"></rect><circle class="cls-8" cx="46" cy="18" r="15"></circle><ellipse class="cls-4" cx="46" cy="18" rx="8" ry="15"></ellipse><ellipse class="cls-7" cx="46" cy="18" rx="15" ry="5"></ellipse><path class="cls-6" d="M46,2c-8.82,0-16,7.18-16,16s7.18,16,16,16,16-7.18,16-16S54.82,2,46,2Zm-7,16c0-1.19,.09-2.34,.23-3.44,1.68-.3,3.62-.49,5.77-.54v7.97c-2.15-.05-4.09-.24-5.77-.54-.15-1.11-.23-2.26-.23-3.44Zm-1.84,3c-3.27-.84-5.16-2.04-5.16-3s1.89-2.16,5.16-3c-.1,.97-.16,1.97-.16,3s.06,2.03,.16,3ZM47,4.17c2.4,.72,4.44,3.97,5.41,8.3-1.72-.26-3.55-.41-5.41-.45V4.17Zm-2,0v7.85c-1.85,.04-3.68,.19-5.41,.45,.96-4.34,3.01-7.58,5.41-8.3Zm0,19.82v7.85c-2.4-.72-4.44-3.97-5.41-8.3,1.72,.26,3.55,.41,5.41,.45Zm2,7.85v-7.85c1.85-.04,3.68-.19,5.41-.45-.96,4.34-3.01,7.58-5.41,8.3Zm0-9.85v-7.97c2.15,.05,4.09,.24,5.77,.54,.15,1.11,.23,2.26,.23,3.44s-.09,2.34-.23,3.44c-1.68,.3-3.62,.49-5.77,.54Zm7.84-6.98c3.27,.84,5.16,2.04,5.16,3s-1.89,2.16-5.16,3c.1-.97,.16-1.97,.16-3s-.06-2.03-.16-3Zm4.75-.31c-1.3-.78-3.05-1.39-5.05-1.83-.59-3.18-1.71-5.88-3.19-7.79,4.08,1.69,7.18,5.26,8.24,9.62ZM40.66,5.07c-1.48,1.92-2.6,4.61-3.19,7.79-2.01,.44-3.75,1.06-5.05,1.83,1.06-4.36,4.16-7.93,8.24-9.62Zm-8.24,16.25c1.3,.78,3.05,1.39,5.05,1.83,.59,3.18,1.71,5.88,3.19,7.79-4.08-1.69-7.18-5.26-8.24-9.62Zm18.93,9.62c1.48-1.92,2.6-4.61,3.19-7.79,2.01-.44,3.75-1.06,5.05-1.83-1.06,4.36-4.16,7.93-8.24,9.62Z"></path><rect class="cls-7" height="2" width="2" x="45" y="36"></rect><rect class="cls-7" height="2" width="2" x="42" y="40"></rect><rect class="cls-7" height="2" width="2" x="38" y="42"></rect></g></svg>`,
        active: active,
    }));

    return Promise.resolve(circuits);
}

export async function getCircuitById(idC: number): Promise<Circuit | null> {



    const options = setFetchOptions({ method: "GET" });

    const session = await getSession();
    if (!session) throw new Error(`No session data available`);

    const accessToken = session?.user.accessToken.token;

    const [err, status, msg, res] = await safeApiCall<Circuit>(api.get(accessToken, `/circuit/${idC}`, options));
    if (err || msg || status !== 200) return null;

    return res || null;
}


//lo state è relativo all'oggetto che sto salvando e è nel fil definition
//la fomr data è fissa e generica di tipo form data 
//il promise va specificato perchè non è un circuito ma un circuito form state
//la form data è un oggetto di tipo form data che contiene i dati del circuito da salvare
export async function saveOrUpdateCircuit(state: CircuitFormState | undefined, formData: FormData): Promise<CircuitFormState | undefined> {

    const idC = formData.get('idC');
    if (idC === undefined || idC === null)
        return undefined;


    //estraggo i dati dal form
    const validatedFields = Circuit.safeParse({
        idC: parseInt(idC.toString()),
        name: formData.get('name'),
        place: formData.get('place'),
        state: formData.get('state'),
        circuitImage: formData.get('circuitImage'),
        active: formData.get('active') === 'true',
    });

    //verifico le validazioni
    if (!validatedFields.success) {
        console.error("Validation failed:", validatedFields.error.format());
        return { errors: validatedFields.error.flatten().fieldErrors }; //restituisco gli errori di validazione: una stringa di errore per ogni campo
    }

    const errorMessage = { message: "Error saving circuit" };

    const options = setFetchOptions({ method: "POST" });    //il form data contiene, deve contenere, tutti i campi del model che le API accettano

    const session = await getSession();
    if (!session) throw new Error(`No session data available`); // mi ributta alla pagina error.tsx

    const accessToken = session?.user.accessToken.token;

    const [err, status, msg, res] = await safeApiCall<Circuit>(
        api.post(accessToken,
            `/circuit`, //endpooint
            options,    //opzioni di fetch (headers, method, body)
            { ...validatedFields.data } //è il BODY in maniera grezza (passa il modello alla PAI gestendolo dentro al metodo di Matteo (api.post))
        ));
    if (DEBUG) console.log("Response from API:", res, status, msg, err); //debug
    if (err || msg || status !== 200) {
        console.error("Error saving circuit:", err, msg, status);
        return errorMessage;
    }
    return {
        ...state, ...{ errors: undefined }  //restituisco lo stato del circuito aggiornato, senza errori
    };
}