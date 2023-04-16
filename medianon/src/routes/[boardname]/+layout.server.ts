import { FIREBASECONFIG } from "$env/static/private";
const firebaseconfig = JSON.parse(FIREBASECONFIG);
// console.log(firebaseconfig);
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, getDocs, collection, query, deleteDoc, where, setDoc } from "firebase/firestore";
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);

import type { LayoutServerLoad } from "./$types";
import type { boardata, threadata } from '$lib/store';

export const load: LayoutServerLoad = async ({ params }) => {
    const currentime = Date.now();
    const boardname: string = params.boardname;
    
    const docref = doc(db, "boards", boardname);
    const docsnap = await getDoc(docref);

    if (docsnap.exists()){
        const boardsnapdata = docsnap.data();
        const boardata: boardata = {
            adminpass: boardsnapdata.adminpass,
            boardtype: boardsnapdata.boardtype,
            entrypass: boardsnapdata.entrypass,
            lastactive: boardsnapdata.lastactive,
            ongoing: boardsnapdata.ongoing,
            title: boardsnapdata.title
        }
        // console.log(boardata);
        
        if (currentime > boardsnapdata.delete){
            await deleteDoc(doc(db, "boards", boardname));
            return {nothere: boardname};
        }
        const threadref = collection(db, "boards", boardname, "threads");

        const threadelquery = query(threadref, where("delete", "<", currentime));
        const threadelsnap = await getDocs(threadelquery);
        let gallows: Array<string> = [];
        threadelsnap.forEach(async (doc) => {
            gallows.push(doc.id)
        })
        if (gallows.length != 0){
            console.log("rip");
            
            gallows.forEach(async (thread) => {
                await deleteDoc(doc(db, "boards", boardname, "threads", thread));
            });
        }

        const threadqueryget = query(threadref, where("archive", ">", currentime));
        const threadsnap = await getDocs(threadqueryget);

        let threads:{
            threadid: string,
            threadata: threadata
        }[] = threadsnap.docs.map((doc) => ({
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

        if (threads.length != boardsnapdata.threadcount){
            await setDoc(docref, {
                threadcount: threads.length
            }, {merge: true})
        }

        // console.log(threads);
        
        return {boardata: boardata, threads: threads};
    }else{
        return {nothere: boardname};
    }
}