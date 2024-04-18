import type { PageServerLoad, Actions } from './$types';
// import { FIREBASECONFIG } from "$env/static/private";
// const firebaseconfig = JSON.parse(FIREBASECONFIG);
const firebaseconfig = {
    // yours
};
import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, updateDoc, getDocs, query, limit, deleteDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from 'firebase/storage';
import type { report } from '$lib/store';
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);

export const load: PageServerLoad = (async () => {
    const reportref = collection(db, "reports");
    const reportquery = query(reportref, limit(10));
    const reportsnap = await getDocs(reportquery);
    let reports: report[] = [];
    reportsnap.docs.forEach((doc) => {
            reports.push({
                docid: doc.id,
                boardname: doc.get("boardname"),
                threadid: doc.get("threadid"),
                postnum: doc.get("postnum"),
                filename: doc.get("filename"),
                url: doc.get("url"),
                reason: doc.get("reason"),
                reportrefid: doc.get("reportrefid")
            })
    })
    return {reports};
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async({request})=>{
        const formdata = await request.formData();
        const reportstring = formdata.get("reportstring") as string;
        const report: report = JSON.parse(reportstring);
        const outcome = formdata.get("outcome") as string;
        const reportref = doc(db, "boards", report.boardname, "reports", report.reportrefid);
        const mainref = doc(db, "reports", report.docid);
        const storage = getStorage();
        switch(outcome){
            case "Keep":
                await deleteDoc(reportref);
                await deleteDoc(mainref);
                if(report.postnum == undefined){
                    const threadref = doc(db, "boards", report.boardname, "threads", report.threadid);
                    await updateDoc(threadref, {
                        reported: 3
                    });
                }else{
                    const postref = doc(db, "boards", report.boardname, "threads", report.threadid, "replies", report.postnum);
                    await updateDoc(postref, {
                        reported: 3
                    })
                }
                break;
            case "Keep NSFW":
                await deleteDoc(reportref);
                await deleteDoc(mainref);
                if(report.postnum == undefined){
                    const threadref = doc(db, "boards", report.boardname, "threads", report.threadid);
                    await updateDoc(threadref, {
                        reported: 4
                    });
                }else{
                    const postref = doc(db, "boards", report.boardname, "threads", report.threadid, "replies", report.postnum);
                    await updateDoc(postref, {
                        reported: 4
                    })
                }
                break;
            case "Delete entirely":
                await deleteDoc(reportref);
                await deleteDoc(mainref);
                if(report.postnum == undefined){
                    const threadref = doc(db, "boards", report.boardname, "threads", report.threadid);
                    await updateDoc(threadref, {
                        reported: 6,
                        url: ""
                    });
                    const fullpath: string = report.boardname+"/"+report.threadid+"/"+report.filename;
                    const storageref = ref(storage, fullpath);
                    await deleteObject(storageref);
                }else{
                    const postref = doc(db, "boards", report.boardname, "threads", report.threadid, "replies", report.postnum);
                    await updateDoc(postref, {
                        reported: 6,
                        url: ""
                    });
                    const fullpath: string = report.boardname+"/"+report.threadid+"/"+report.postnum+"/"+report.filename;
                    const storageref = ref(storage, fullpath);
                    await deleteObject(storageref);
                }
                break;
        }
        return {success: true};
    }}