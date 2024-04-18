// import { FIREBASECONFIG } from "$env/static/private";
// const firebaseconfig = JSON.parse(FIREBASECONFIG);
const firebaseconfig = {
    // yours
};
// console.log(firebaseconfig);
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);

import type { PageServerLoad } from "./$types";
import type { threadata, postdata } from "$lib/store";

export const load: PageServerLoad = (async ({ params }) => {
    const currentime = Date.now();
    const boardname: string = params.boardname;
    const threadid: string = params.thread;
    
    const threadref = doc(db, "boards", boardname, "threads", threadid)
    const threadoc = await getDoc(threadref);
    let threadata: threadata = {
            archive: threadoc.get("archive"),
            bump: threadoc.get("bump"),
            content: threadoc.get("content"),
            title: threadoc.get("title"),
            deltime: threadoc.get("deltime"),
            made: threadoc.get("made"),
            replies: threadoc.get("replies"),
            reported: threadoc.get("reported"),
            filename: threadoc.get("filename"),
            url: threadoc.get("url"),
    };
    if (currentime > threadata.archive){
        return {redurl: "/"+boardname+"/a/"+threadid}
    }

    const replyref = collection(db, "boards", boardname, "threads", threadid, "replies");
    const replyquery = query(replyref, where("layer", "==", 1))
    const replysnap = await getDocs(replyquery);

    let replies: postdata[] = [];
    replysnap.forEach((doc) => {
        replies.push({
            postnum: doc.get("postnum"),
            content: doc.get("content"),
            made: doc.get("made"),
            replies: doc.get("replies"),
            parent: doc.get("parent"),
            layer: doc.get("layer"),
            reported: doc.get("reported"),
            filename: doc.get("filename"),
            url: doc.get("url"),
        })
    })
    
    return {threadata: threadata, replies: replies};
})satisfies PageServerLoad;