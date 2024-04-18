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

import type { PageServerLoad } from './$types';
import type { threadata, postdata } from "$lib/store";

export const load: PageServerLoad = (async ({ params }) => {
    // const currentime = Date.now();
    const postid: string = params.post;
    const boardid: string = params.boardname;
    const threadid: string = params.thread;
    
    const threadref = doc(db, "boards", boardid, "threads", threadid);
    const threadoc = await getDoc(threadref);
    const threadata: threadata = {
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
    }

    const currentref = doc(db, "boards", boardid, "threads", threadid, "replies", postid);
    const currentdoc = await getDoc(currentref);
    const currentpost: postdata = {
        postnum: currentdoc.get("postnum"),
        content: currentdoc.get("content"),
        made: currentdoc.get("made"),
        replies: currentdoc.get("replies"),
        parent: currentdoc.get("parent"),
        layer: currentdoc.get("layer"),
        reported: currentdoc.get("reported"),
        filename: currentdoc.get("filename"),
        url: currentdoc.get("url"),
    };
    const nextlayer = currentpost?.layer + 1;

    const replyref = collection(db, "boards", boardid, "threads", threadid, "replies");
    const replyquery = query(replyref, where("layer", "<=", nextlayer))
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

    // console.log(replies);
    
    return {threadata: threadata, currentpost: currentpost, replies: replies};
    
})satisfies PageServerLoad;