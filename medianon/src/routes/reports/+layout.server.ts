import type { LayoutServerLoad } from './$types';
// import { FIREBASECONFIG } from "$env/static/private";
// const firebaseconfig = JSON.parse(FIREBASECONFIG);
const firebaseconfig = {
    // yours
};
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);

export const load = (async () => {
    const passref = doc(db, "passwords", "reports");
    const passdoc = await getDoc(passref);
    const passtring: string = passdoc.get("password");
    return {passtring: passtring};
}) satisfies LayoutServerLoad;