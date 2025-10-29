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
    const boardref = doc(db, "boards", boardname);
    const boardsnap = await getDoc(boardref);
    const boardata: boardatatype = boardsnap.data() as boardatatype;
    if(boardata.api){
        let resobj: {
            board: boardatatype,
            threads: {
                id: string,
                data: threadatatype
            }[]
        } = {
            board: boardata,
            threads: []
        };
        const threadref = collection(db, "boards", boardname, "threads");
        const threadsnap = await getDocs(threadref);
        const threads = threadsnap.docs;
        threads.forEach((doc)=>{
            resobj.threads.push({
                id: doc.id,
                data: doc.data() as threadatatype
            })
        })
        return json(resobj)
    } else {
        return json({error: "api access disabled"});
    }
};