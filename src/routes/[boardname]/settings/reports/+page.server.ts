import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, getDocs, deleteDoc, collection, query, where, updateDoc, limit } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { FIREBASE } from '$env/static/private';
import type { PageServerLoad, Actions } from "./$types";
const firebaseconfig = JSON.parse(FIREBASE);
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);

export const load: PageServerLoad = (async ({params}) => {
    const boardname = params.boardname;
    const reportref = collection(db, "boards", boardname, "reports");
    const reportlimit = query(reportref, limit(50));
    const reportsnap = await getDocs(reportlimit);
    let reports:{
        docid: string,
        threadid: string,
        replynum: string,
        filename: string,
        url: string,
        reason: string,
    }[] = [];
    reportsnap.forEach((doc) => {
        let data = doc.data();
        reports.push({
            docid: doc.id,
            threadid: data.threadid,
            replynum: data.replynum,
            filename: data.filename,
            url: data.url,
            reason: data.reason
        })
    })
    return {reports};
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async({request, params})=>{
        const formdata = await request.formData();
        const reportstring = formdata.get("reportstring") as string;
        const report: {
            docid: string,
            threadid: string,
            replynum: string,
            filename: string,
            url: string,
            reason: string
        } = JSON.parse(reportstring);
        const outcome = formdata.get("outcome") as string;
        const reportref = doc(db, "boards", params.boardname, "reports", report.docid);
        switch(outcome){
            case "Allow":
                await deleteDoc(reportref);
                if(report.replynum == "-1"){
                    const threadref = doc(db, "boards", params.boardname, "threads", report.threadid);
                    await updateDoc(threadref, {
                        report: 2
                    });
                }else{
                    const postref = doc(db, "boards", params.boardname, "threads", report.threadid, "replies", report.replynum);
                    await updateDoc(postref, {
                        report: 2
                    })
                }
                break;
            case "Allow and mark as NSFW":
                await deleteDoc(reportref);
                if(report.replynum == "-1"){
                    const threadref = doc(db, "boards", params.boardname, "threads", report.threadid);
                    await updateDoc(threadref, {
                        report: 3
                    });
                }else{
                    const postref = doc(db, "boards", params.boardname, "threads", report.threadid, "replies", report.replynum);
                    await updateDoc(postref, {
                        report: 3
                    })
                }
                break;
            case "Delete entirely":
                const storage = getStorage();
                await deleteDoc(reportref);
                if(report.replynum == "-1"){
                    const threadref = doc(db, "boards", params.boardname, "threads", report.threadid);
                    await updateDoc(threadref, {
                        report: 0,
                        url: ""
                    });
                    const fullpath: string = params.boardname+"/"+report.threadid+"/"+report.filename;
                    const storageref = ref(storage, fullpath);
                    await deleteObject(storageref);
                }else{
                    const postref = doc(db, "boards", params.boardname, "threads", report.threadid, "replies", report.replynum);
                    await updateDoc(postref, {
                        report: 0,
                        url: ""
                    });
                    const fullpath: string = params.boardname+"/"+report.threadid+"/"+report.replynum+"/"+report.filename;
                    const storageref = ref(storage, fullpath);
                    await deleteObject(storageref);
                }
                break;
        }
        return {success: true};
    }}