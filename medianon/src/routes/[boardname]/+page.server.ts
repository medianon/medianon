// import { FIREBASECONFIG } from "$env/static/private";
// const firebaseconfig = JSON.parse(FIREBASECONFIG);
const firebaseconfig = {
    // yours
};
// console.log(firebaseconfig);
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, getDocs, collection, query, deleteDoc, where, updateDoc } from "firebase/firestore";
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);

import type { PageServerLoad } from './$types';
import type { threadata } from '$lib/store';
import { getStorage, ref, deleteObject, listAll } from "firebase/storage";

export const load: PageServerLoad = (async ({ params }) => {
    const currentime = Date.now();
    const boardname: string = params.boardname;
    const docref = doc(db, "boards", boardname);
    const docsnap = await getDoc(docref);

    if (docsnap.exists()){
        const boardsnapdata = docsnap.data();
        const threadref = collection(db, "boards", boardname, "threads");
        const threadelquery = query(threadref, where("deltime", "<", currentime));
        const threadelsnap = await getDocs(threadelquery);
        if(!threadelsnap.empty){
            console.log("rip");
            threadelsnap.forEach(async(document)=>{
                if(document.get("reported") != 7){
                    const storage = getStorage();
                    const rootpath: string = boardname+"/"+document.id;
                    const rootref = ref(storage, rootpath);
                    listAll(rootref).then((result)=>{
                        if(result.prefixes.length > 0){
                            result.prefixes.forEach((reply)=>{
                                listAll(reply).then((result2)=>{
                                    result2.items.forEach(async(replyimg)=>{
                                        await deleteObject(replyimg);
                                    })
                                });
                            })
                        }
                        result.items.forEach(async(threadimg)=>{
                            await deleteObject(threadimg);
                        })
                    });
                }
                await deleteDoc(doc(db, "boards", boardname, "threads", document.id));
            })
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
                bump: doc.get("bump"),
                content: doc.get("content"),
                title: doc.get("title"),
                deltime: doc.get("deltime"),
                made: doc.get("made"),
                replies: doc.get("replies"),
                reported: doc.get("reported"),
                filename: doc.get("filename"),
                url: doc.get("url")
            }
        }));

        if (threads.length != boardsnapdata.threadcount){
            await updateDoc(docref, {threadcount: threads.length});
        }
        
        return {threads: threads};
    }
})satisfies PageServerLoad;