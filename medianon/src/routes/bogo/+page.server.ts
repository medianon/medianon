// import { FIREBASECONFIG } from "$env/static/private";
// const firebaseconfig = JSON.parse(FIREBASECONFIG);
const firebaseconfig = {
    // yours
};
// console.log(firebaseconfig);
import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection, query, where, doc } from "firebase/firestore";
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);

import type { PageServerLoad } from "./$types";
import type { threadata, postdata } from "$lib/store";

export const load: PageServerLoad = (async () => {

    const boardref = collection(db, "boards");
    const bogoquery = query(boardref, where("bogo", "==", true))
    let bogodocs = await getDocs(bogoquery);

    const bogoboardsize = bogodocs.size;
    if (bogoboardsize == 0){
        return {
            failure: "No content to sort"
        }
    }
    const boardid = Math.floor(Math.random() * bogoboardsize);
    const selectedboard = bogodocs.docs[boardid].id;
    
    const bogothreadref = collection(db, "boards", selectedboard, "threads");
    bogodocs = await getDocs(bogothreadref);

    const bogothreadsize = bogodocs.size;
    if (bogothreadsize == 0){
        return {
            failure: "Selected board has no threads",
        }
    }
    const threadid = Math.floor(Math.random() * bogothreadsize);
    const selecthread = bogodocs.docs[threadid].id;
    const done = Math.floor(Math.random() * 2);
    if (done > 0){
        const threadata: threadata = {
            archive: bogodocs.docs[threadid].get("archive"),
            bump: bogodocs.docs[threadid].get("bump"),
            content: bogodocs.docs[threadid].get("content"),
            title: bogodocs.docs[threadid].get("title"),
            deltime: bogodocs.docs[threadid].get("delete"),
            made: bogodocs.docs[threadid].get("made"),
            replies: bogodocs.docs[threadid].get("replies"),
            filename: bogodocs.docs[threadid].get("filename"),
            url: bogodocs.docs[threadid].get("url"),
            reported: bogodocs.docs[threadid].get("reported")
        }
        return {
            boardname: selectedboard,
            threadid: selecthread,
            threadata: threadata
        }
    } else {

        const bogoreplyref = collection(db, "boards", selectedboard, "threads", selecthread, "replies");
        bogodocs = await getDocs(bogoreplyref);
        
        const bogoreplysize = bogodocs.size;
        if (bogoreplysize == 0){
            return {
                failure: "Selected thread has no replies"
            }
        }
        const postid = Math.floor(Math.random() * bogoreplysize);
        const selectedpost = bogodocs.docs[postid].id;
        const postdata: postdata = {
            postnum: bogodocs.docs[postid].get("postnum"),
            content: bogodocs.docs[postid].get("content"),
            made: bogodocs.docs[postid].get("made"),
            replies: bogodocs.docs[postid].get("replies"),
            parent: bogodocs.docs[postid].get("parent"),
            layer: bogodocs.docs[postid].get("layer"),
            filename: bogodocs.docs[postid].get("filename"),
            url: bogodocs.docs[postid].get("url"),
            reported: bogodocs.docs[postid].get("reported")
        };
        return {
            boardname: selectedboard,
            threadid: selecthread,
            postnum: selectedpost,
            postdata: postdata
        }   
    }
    return {failure: 1}
})satisfies PageServerLoad;