import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection, query, where, orderBy, limit } from "firebase/firestore";
import { FIREBASE } from '$env/static/private';
import type { PageServerLoad } from "./$types";
import type { boardatatype } from "$lib/index.svelte";
const firebaseconfig = JSON.parse(FIREBASE);
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);

export const load = (async () => {
    const boardref = collection(db, "boards");
    const lbquery = query(boardref, where("leaderboard", "==", true), where("replynum", ">", 99), orderBy("replynum", "desc"), limit(30));
    const lbdocs = await getDocs(lbquery);
    let lbdata: {
        boardname: string,
        boardata: boardatatype
    }[] = [];
    lbdocs.forEach( doc =>{
        let boardata: boardatatype = doc.data() as boardatatype;
        lbdata.push({
            boardname: doc.id,
            boardata: boardata
        });
    });
    return {lbdata};
}) satisfies PageServerLoad;