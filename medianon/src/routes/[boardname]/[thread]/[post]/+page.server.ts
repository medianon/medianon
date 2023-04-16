import { FIREBASECONFIG } from "$env/static/private";
const firebaseconfig = JSON.parse(FIREBASECONFIG);
// console.log(firebaseconfig);
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, getDocs, collection, query, orderBy, endAt } from "firebase/firestore";
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);

import type { PageServerLoad } from "./$types";
import type { threadata, postdata } from '$lib/store';

export const load: PageServerLoad = (async ({ params }) => {
    const currentime = Date.now();
    const boardname: string = params.boardname;
    const threadid: string = params.thread;
    const postid: string = params.post;
    
    const threadref = doc(db, "boards", boardname, "threads", threadid)
    const threadoc = await getDoc(threadref);

    let threadata: threadata = {
        archive: threadoc.get("archive"),
        boxes: threadoc.get("boxes"),
        bump: threadoc.get("bump"),
        content: threadoc.get("content"),
        title: threadoc.get("title"),
        deltime: threadoc.get("deltime"),
        made: threadoc.get("made"),
        replies: threadoc.get("replies")
    };
    if (currentime > threadata.archive){
        return {redurl: "/"+boardname+"/a/"+threadid+"/"+params.post}
    }

    const currentref = doc(db, "boards", boardname, "threads", threadid, "replies", postid);
    const currentdoc = await getDoc(currentref);
    const currentpost: postdata = {
        postnum: currentdoc.get("postnum"),
        content: currentdoc.get("content"),
        made: currentdoc.get("made"),
        boxes: currentdoc.get("boxes"),
        replies: currentdoc.get("replies"),
        parent: currentdoc.get("parent"),
        layer: currentdoc.get("layer")
    };
    const nextlayer = currentpost?.layer + 1;

    const replyref = collection(db, "boards", boardname, "threads", threadid, "replies");
    const replyquery = query(replyref, orderBy("layer"), endAt(nextlayer))
    const replysnap = await getDocs(replyquery);

    let replies: postdata[] = [];
    replysnap.forEach((doc) => {
        replies.push({
            postnum: doc.get("postnum"),
            content: doc.get("content"),
            made: doc.get("made"),
            boxes: doc.get("boxes"),
            replies: doc.get("replies"),
            parent: doc.get("parent"),
            layer: doc.get("layer")
        })
    })
    // console.log(replies);
    
    return {threadata: threadata, currentpost: currentpost, replies: replies};
})satisfies PageServerLoad;