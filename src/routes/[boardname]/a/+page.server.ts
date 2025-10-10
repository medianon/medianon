import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, getDocs, deleteDoc, collection, query, where, updateDoc } from "firebase/firestore";
import { FIREBASE } from '$env/static/private';
import type { PageServerLoad } from "./$types";
import type { threadatatype } from "$lib/index.svelte";
const firebaseconfig = JSON.parse(FIREBASE);
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);

export const load: PageServerLoad = async ({params}) => {
    const boardname: string = params.boardname;
    const currentime = Date.now();
    const threadref = collection(db, "boards", boardname, "threads");
    const archivequery = query(threadref, where("archivetime", "<", currentime));
    const archivesnap = await getDocs(archivequery);
    let archive: {
        threadid: string,
        threadata: threadatatype
    }[] = [];
    archivesnap.forEach( (document) => {
        archive.push({threadid: document.id, threadata: document.data() as threadatatype});
    });
    return {archive};
}