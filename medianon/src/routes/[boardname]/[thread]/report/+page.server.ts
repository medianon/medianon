import type { Actions } from "../$types";
// import { FIREBASECONFIG } from "$env/static/private";
// const firebaseconfig = JSON.parse(FIREBASECONFIG);
const firebaseconfig = {
    // yours
};
import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, updateDoc, addDoc } from "firebase/firestore";
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);
export const actions: Actions = {
    default: async({request, params})=>{
        const boardname = params.boardname;
        const threadid = params.thread;
        const formdata = await request.formData();
        const reason = formdata.get("reason")?.toString();
        const imgstr = formdata.get("imgstr")!.toString();
        const imgjson: {
            filename: string,
            url: string
        } = JSON.parse(imgstr);

        const postref = doc(db, "boards", boardname, "threads", threadid);
        await updateDoc(postref, {
            reported: 5
        });

        const reportref = await addDoc(collection(db, "boards", boardname, "reports"), {
            threadid: threadid,
            filename: imgjson.filename,
            url: imgjson.url,
            reason: reason
        });

        await addDoc(collection(db, "reports"), {
            boardname: boardname,
            threadid: threadid,
            filename: imgjson.filename,
            url: imgjson.url,
            reason: reason,
            reportrefid: reportref.id
        });
        return({success: true});
    }
}