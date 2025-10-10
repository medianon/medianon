import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, getDocs, deleteDoc, collection, query, where, updateDoc, limit } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { FIREBASE } from '$env/static/private';
import type { PageServerLoad, Actions } from "./$types";
const firebaseconfig = JSON.parse(FIREBASE);
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);

export const load: PageServerLoad = (async ({params}) => {
    const passwordref = doc(db, "passwords", "reports");
    const passwordoc = await getDoc(passwordref);
    let password = "";
    if(passwordoc.exists()){
        password = passwordoc.data().password;
    }
    const reportref = collection(db, "reports");
    const reportlimit = query(reportref, limit(50));
    const reportsnap = await getDocs(reportlimit);
    let reports:{
        docid: string,
        boardname: string,
        threadid: string,
        replynum: string,
        filename: string,
        url: string,
        reason: string,
        reportrefid: string
    }[] = [];
    reportsnap.forEach((doc) => {
        let data = doc.data();
        reports.push({
            docid: doc.id,
            boardname: data.boardname,
            threadid: data.threadid,
            replynum: data.replynum,
            filename: data.filename,
            url: data.url,
            reason: data.reason,
            reportrefid: data.reportrefid
        })
    })
    return {reports: reports, password: password};
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async({request, params})=>{
        const formdata = await request.formData();
        const reportstring = formdata.get("reportstring") as string;
        const report: {
            docid: string,
            boardname: string,
            threadid: string,
            replynum: string,
            filename: string,
            url: string,
            reason: string,
            reportrefid: string
        } = JSON.parse(reportstring);
        const outcome = formdata.get("outcome") as string;
        const reportref = doc(db, "boards", report.boardname, "reports", report.reportrefid);
        const mainref = doc(db, "reports", report.docid);
        switch(outcome){
            case "Allow":
                await deleteDoc(reportref);
                await deleteDoc(mainref);
                if(report.replynum == "-1"){
                    const threadref = doc(db, "boards", report.boardname, "threads", report.threadid);
                    await updateDoc(threadref, {
                        report: 2
                    });
                }else{
                    const postref = doc(db, "boards", report.boardname, "threads", report.threadid, "replies", report.replynum);
                    await updateDoc(postref, {
                        report: 2
                    })
                }
                break;
            case "Allow and mark as NSFW":
                await deleteDoc(reportref);
                await deleteDoc(mainref);
                if(report.replynum == "-1"){
                    const threadref = doc(db, "boards", report.boardname, "threads", report.threadid);
                    await updateDoc(threadref, {
                        report: 3
                    });
                }else{
                    const postref = doc(db, "boards", report.boardname, "threads", report.threadid, "replies", report.replynum);
                    await updateDoc(postref, {
                        report: 3
                    })
                }
                break;
            case "Delete entirely":
                const storage = getStorage();
                await deleteDoc(reportref);
                await deleteDoc(mainref);
                if(report.replynum == "-1"){
                    const threadref = doc(db, "boards", report.boardname, "threads", report.threadid);
                    await updateDoc(threadref, {
                        report: 0,
                        url: ""
                    });
                    const fullpath: string = report.boardname+"/"+report.threadid+"/"+report.filename;
                    const storageref = ref(storage, fullpath);
                    await deleteObject(storageref);
                }else{
                    const postref = doc(db, "boards", report.boardname, "threads", report.threadid, "replies", report.replynum);
                    await updateDoc(postref, {
                        report: 0,
                        url: ""
                    });
                    const fullpath: string = report.boardname+"/"+report.threadid+"/"+report.replynum+"/"+report.filename;
                    const storageref = ref(storage, fullpath);
                    await deleteObject(storageref);
                }
                break;
        }
        return {success: true};
    }}