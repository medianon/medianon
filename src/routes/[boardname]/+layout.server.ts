// import { initializeApp } from "firebase/app";
// import { getFirestore, doc, getDoc, getDocs, deleteDoc, query, where, collection } from "firebase/firestore";
import { getStorage, ref, listAll, deleteObject } from "firebase/storage";
import admin from "firebase-admin";
// import { FIREBASE } from '$env/static/private';
import { ADMIN } from '$env/static/private';
import type { LayoutServerLoad } from "./$types";
import type { boardatatype } from "$lib/index.svelte";
// const firebaseconfig = JSON.parse(FIREBASE);
const adminconfig = JSON.parse(ADMIN);
const adminapp = admin.initializeApp({
    credential: admin.credential.cert(adminconfig)
});
// const app = initializeApp(firebaseconfig);
// const db = getFirestore(app);
const adminfs = admin.firestore(adminapp);

export const load: LayoutServerLoad = async ({params}) => {
    const currentime = Date.now();
    const boardname: string = params.boardname;
    const docref = adminfs.doc("boards/"+boardname);
    const docsnap = await docref.get();
    if (docsnap.exists){
        const boardata = docsnap.data() as boardatatype;
        if((boardata.boardtype == "Custom")){
            if (currentime > boardata.lastactive+boardata.boardeltime){
                const delref = adminfs.doc("boards/"+boardname);
                adminfs.recursiveDelete(delref);
                // await deleteDoc(doc(db, "boards", boardname));
                return {nothere: boardname};
            }
        }
        if(boardata.threadcount > boardata.maxthreads){
            const diff = boardata.threadcount - boardata.maxthreads;
            const threadref = adminfs.collection("boards/"+boardname+"/threads");
            const threadgetquery = threadref.where("archivetime", ">", currentime);
            // const threadgetquery = query(threadref, where("archivetime", ">", currentime));
            const threadgetsnap = await threadgetquery.get();
            let idbump: {
                threadid: string,
                bump: number,
                report: number
            }[] = [];
            threadgetsnap.docs.forEach((doc)=>{
                const threadata = doc.data();
                idbump.push({
                    threadid: doc.id,
                    bump: threadata.bump,
                    report: threadata.report
                })
            })
            idbump = idbump.sort((a, b) => (a.bump < b.bump)? -1 : 1);
            idbump = idbump.splice(0, diff);
            idbump.forEach(async(rip)=>{
                if(rip.report != 5){
                    const storage = getStorage();
                    const rootpath: string = boardname+"/"+rip.threadid;
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
                const delref = adminfs.doc("boards/"+boardname+"/threads/"+rip.threadid);
                adminfs.recursiveDelete(delref);
                // await deleteDoc(doc(db, "boards", boardname, "threads", rip.threadid));
            })
        }
        return {boardata: boardata};
    }else{
        return {nothere: boardname};
    }
};
