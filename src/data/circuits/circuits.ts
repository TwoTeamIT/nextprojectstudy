import api from "@/lib/apiCaller";
import { safeApiCall } from "@/lib/errorHandler";
import { setFetchOptions } from "@/lib/formatFetchOptions";
import { Circuit, CircuitFormState } from "./definitions";
import { getSession } from "../auth/stateless-session";
import { DEBUG } from "@/configs";

//boolean = true è il default
export async function getAllCircuits(active: boolean = true): Promise<Circuit[]> {
    const options = setFetchOptions({ method: "GET" });

    const session = await getSession();
    if (!session) throw new Error(`No session data available`);

    const accessToken = session?.user.accessToken.token;

    const [err, status, msg, res] = await safeApiCall<Circuit[]>(api.get(accessToken, `/circuit/${active}`, options));
    if (err || msg || status !== 200) return [];

    return res || [];
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