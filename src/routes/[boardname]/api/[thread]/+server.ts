import type { RequestHandler } from './$types';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { FIREBASE } from '$env/static/private';
import type { boardatatype, threadatatype, replydatatype } from "$lib/index.svelte";
import { json } from '@sveltejs/kit';
const firebaseconfig = JSON.parse(FIREBASE);
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);

export const GET: RequestHandler = async ({params}) => {
    const boardname: string = params.boardname;
    const threadid: string = params.thread;
    const boardref = doc(db, "boards", boardname);
    const boardsnap = await getDoc(boardref);
    const boardata: boardatatype = boardsnap.data() as boardatatype;
    if(boardata.api){
        const threadref = doc(db, "boards", boardname, "threads", threadid);
        const threadsnap = await getDoc(threadref);
        const threadata: threadatatype = threadsnap.data() as threadatatype;
        let resobj: {
            thread: threadatatype,
            replies: replydatatype[]
        } = {
            thread: threadata,
            replies: []
        };
        const replyref = collection(db, "boards", boardname, "threads", threadid, "replies");
        const replysnap = await getDocs(replyref);
        replysnap.forEach((doc)=>{
            resobj.replies.push(doc.data() as replydatatype)
        })
        return json(resobj)
    } else {
        return json({error: "api access disabled"});
    }
};