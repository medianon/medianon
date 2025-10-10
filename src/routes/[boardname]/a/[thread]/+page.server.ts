import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { FIREBASE } from '$env/static/private';
import type { PageServerLoad } from "./$types";
import type { threadatatype, replydatatype } from "$lib/index.svelte";
const firebaseconfig = JSON.parse(FIREBASE);
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);

export const load: PageServerLoad = async({params})=>{
    const currentime = Date.now();
    const boardname: string = params.boardname;
    const threadid: string = params.thread;
    
    const threadref = doc(db, "boards", boardname, "threads", threadid)
    const threadoc = await getDoc(threadref);
    const threadata: threadatatype = threadoc.data() as threadatatype;

    const replyref = collection(db, "boards", boardname, "threads", threadid, "replies");
    const replyquery = query(replyref, where("layer", "==", 1))
    const replysnap = await getDocs(replyquery);

    let replies: replydatatype[] = [];
    replysnap.forEach((doc) => {
        replies.push(doc.data() as replydatatype);
    })
    
    return {threadata: threadata, replies: replies};
}