import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection, query, where, doc } from "firebase/firestore";
import { FIREBASE } from '$env/static/private';
import type { PageServerLoad } from "./$types";
import type { threadatatype, replydatatype } from "$lib/index.svelte";
const firebaseconfig = JSON.parse(FIREBASE);
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);

export const load: PageServerLoad = async()=>{
        const currentime = Date.now();
        const boardref = collection(db, "boards");
        const bogoquery = query(boardref, where("bogo", "==", true))
        let bogodocs = await getDocs(bogoquery);
        const bogoboardsize = bogodocs.size;
        if (bogoboardsize == 0){
            return {
                restype: 0
            }
        }

        const boardindex = Math.floor(Math.random() * bogoboardsize);
        const boardname = bogodocs.docs[boardindex].id;
        const bogothreadref = collection(db, "boards", boardname, "threads");
        bogodocs = await getDocs(bogothreadref);
        const bogothreadsize = bogodocs.size;
        if (bogothreadsize == 0){
            return {
                restype: 1,
                boardname: boardname
            }
        }

        const threadindex = Math.floor(Math.random() * bogothreadsize);
        const threadid = bogodocs.docs[threadindex].id;
        const threadata = bogodocs.docs[threadindex].data() as threadatatype;
        if(threadata.replies == 0){
            if(currentime > threadata.archivetime){
                return {
                    restype: 2,
                    threadobj: {
                        boardname: boardname,
                        archive: true,
                        threadid: threadid,
                        threadata: threadata
                    }
                }
            } else {
                return {
                    restype: 2,
                    threadobj: {
                        boardname: boardname,
                        archive: false,
                        threadid: threadid,
                        threadata: threadata
                    }
                }
            }
        }

        const done = Math.floor(Math.random() * 2);
        if(done > 0){
            if(currentime > threadata.archivetime){
                return {
                    restype: 2,
                    threadobj: {
                        boardname: boardname,
                        archive: true,
                        threadid: threadid,
                        threadata: threadata
                    }
                }
            } else {
                return {
                    restype: 2,
                    threadobj: {
                        boardname: boardname,
                        archive: false,
                        threadid: threadid,
                        threadata: threadata
                    }
                }
            }
        } else {
            const bogoreplyref = collection(db, "boards", boardname, "threads", threadid, "replies");
            bogodocs = await getDocs(bogoreplyref);
            const bogoreplysize = bogodocs.size;
            const postindex = Math.floor(Math.random() * bogoreplysize);
            const replydata: replydatatype = bogodocs.docs[postindex].data() as replydatatype;
            if(currentime > threadata.archivetime){
                return {
                    restype: 3,
                    replyobj: {
                        boardname: boardname,
                        archive: true,
                        threadid: threadid,
                        replydata: replydata
                    }
                }
            } else {
                return {
                    restype: 3,
                    replyobj: {
                        boardname: boardname,
                        archive: false,
                        threadid: threadid,
                        replydata: replydata
                    }
                }
            }
            
        }
}