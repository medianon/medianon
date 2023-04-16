import { FIREBASECONFIG } from "$env/static/private";
const firebaseconfig = JSON.parse(FIREBASECONFIG);
// console.log(firebaseconfig);
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);

import type { PageServerLoad } from "./$types";
import type { threadata } from '$lib/store';

export const load: PageServerLoad = async ({ params }) => {
    const currentime = Date.now();
    const boardid: string = params.boardname;
    
    const docref = doc(db, "boards", boardid);
    const docsnap = await getDoc(docref);

    if (docsnap.exists()){
        const archiveref = collection(db, "boards", boardid, "threads");
        const archivequery = query(archiveref, where("archive", "<", currentime));
        const archivesnap = await getDocs(archivequery);

        let archive:{
            threadid: string,
            threadata: threadata
        }[] = archivesnap.docs.map((doc) => ({
            threadid: doc.id,
            threadata: {
                archive: doc.get("archive"),
                boxes: doc.get("boxes"),
                bump: doc.get("bump"),
                content: doc.get("content"),
                title: doc.get("title"),
                deltime: doc.get("deltime"),
                made: doc.get("made"),
                replies: doc.get("replies")
            }
        }));
        // let archive = archivesnap.docs.map((doc) => ({postnum: doc.id, data: doc.data()}));

        return {archive};
    }
}