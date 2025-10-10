import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, updateDoc, addDoc } from "firebase/firestore";
import { FIREBASE } from "$env/static/private";
const firebaseconfig = JSON.parse(FIREBASE);
import type { Actions } from "../$types";
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);
export const actions: Actions = {
    default: async({request, params})=>{
        const boardname = params.boardname;
        const threadid = params.thread;
        const formdata = await request.formData();
        let reason = formdata.get("reason")!.toString();
        if(reason == undefined){
            reason = "";
        }
        const imgstr = formdata.get("imgstr")!.toString();
        const imgjson: {
            filename: string,
            url: string
        } = JSON.parse(imgstr);

        const threadref = doc(db, "boards", boardname, "threads", threadid);
        await updateDoc(threadref, {
            report: 4
        });

        const reportref = await addDoc(collection(db, "boards", boardname, "reports"), {
            threadid: threadid,
            replynum: "-1",
            filename: imgjson.filename,
            url: imgjson.url,
            reason: reason
        });

        await addDoc(collection(db, "reports"), {
            boardname: boardname,
            threadid: threadid,
            replynum: "-1",
            filename: imgjson.filename,
            url: imgjson.url,
            reason: reason,
            reportrefid: reportref.id
        });
        return({success: true});
    }
}