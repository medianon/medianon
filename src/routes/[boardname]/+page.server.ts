// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getFirestore, doc, getDoc, getDocs, deleteDoc, collection, query, where, updateDoc } from "firebase/firestore";
import admin from "firebase-admin";
import { getStorage, ref, listAll, deleteObject } from "firebase/storage";
// import { FIREBASE } from '$env/static/private';
import { ADMIN } from '$env/static/private';
import type { PageServerLoad } from "./$types";
import type { boardatatype, threadatatype } from "$lib/index.svelte";
// const firebaseconfig = JSON.parse(FIREBASE);
const adminconfig = JSON.parse(ADMIN);
const adminapp = admin.initializeApp({
    credential: admin.credential.cert(adminconfig)
}, 'page');
// const app = initializeApp(firebaseconfig);
// const db = getFirestore(app);
const adminfs = admin.firestore(adminapp);

export const load: PageServerLoad = async ({params}) => {
    const boardname: string = params.boardname;
    const currentime = Date.now();
    const boardref = adminfs.doc("boards/"+boardname);
    const boardsnap = await boardref.get();
    if(boardsnap.exists){
        const boardata = boardsnap.data() as boardatatype;
        const threadref = adminfs.collection("boards/"+boardname+"/threads");
        const threadelquery = threadref.where("archivedeltime", "<", currentime);
        const threadelsnap = await threadelquery.get();
        if(!threadelsnap.empty){
            threadelsnap.forEach( async (document) => {
                if(document.get("report") != 5){
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
                const delref = adminfs.doc("boards/"+boardname+"/threads/"+document.id);
                adminfs.recursiveDelete(delref);
                // await deleteDoc(doc(db, "boards", boardname, "threads", document.id));
            });
        }
        const threadgetquery = threadref.where("archivetime", ">", currentime);
        const threadgetsnap = await threadgetquery.get();
        let threads: {
            threadid: string,
            threadata: threadatatype
        }[] = [];
        threadgetsnap.forEach((document) => {
        threads.push({threadid: document.id, threadata: document.data() as threadatatype});
    });
    if(threads.length != boardata.threadcount){
        await boardref.update({threadcount: threads.length});
        return({threads: threads, redir: true});
    };
    return({threads: threads, redir: false});
    }
}