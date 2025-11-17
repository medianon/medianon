import type { Actions } from "@sveltejs/kit";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { FIREBASE } from '$env/static/private';
import bcrypt from "bcryptjs";
const firebaseconfig = JSON.parse(FIREBASE);
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);

export const actions = {
    update: async ({request, params}) => {
        // const currentime = Date.now();
        const boardname: string = params.boardname as string;
        const formdata = await request.formData();
        const title = formdata.get("title")?.toString();
        let entry = formdata.get("entry")!.toString();
        let admin = formdata.get("admin")!.toString();
        if(entry!=""){
            entry = await bcrypt.hash(entry, 3);
        }
        if(admin!=""){
            admin = await bcrypt.hash(admin, 3);
        }
        const bogo = formdata.get("bogo");
        let bogouse: boolean = false;
        if (bogo != null){
            bogouse = true;
        }
        const leaderboard = formdata.get("leaderboard");
        let leaderboarduse: boolean = false;
        if (leaderboard != null){
            leaderboarduse = true;
        }
        const threadimages = formdata.get("threadimages");
        let threadimageuse: boolean = false;
        if (threadimages != null){
            threadimageuse = true;
        }
        const replyimages = formdata.get("replyimages");
        let replyimageuse: boolean = false;
        if (replyimages != null){
            replyimageuse = true;
        }
        const api = formdata.get("api");
        let apiuse: boolean = false;
        if (api != null){
            apiuse = true;
        }
        const maxthreads = formdata.get("maxthreads")!.toString();
        const description = formdata.get("description")!.toString();
        let thread = formdata.get("thread")!.toString();
        let reply = formdata.get("reply")!.toString();
        if(thread!=""){
            thread = await bcrypt.hash(thread, 3);
        }
        if(reply!=""){
            reply = await bcrypt.hash(reply, 3);
        }
        const boardeltime = formdata.get("boardeltime")!.toString();
        const archivetime = formdata.get("archivetime")!.toString();
        const archivedeltime = formdata.get("archivedeltime")!.toString();
        const checkref = doc(db, "boards", boardname);
        const checkdoc = await getDoc(checkref);
        if (checkdoc.exists()){
            await updateDoc(doc(db, "boards", boardname),{
                title: title,
                entrypass: entry,
                adminpass: admin,
                threadpass: thread,
                replypass: reply,
                leaderboard: leaderboarduse,
                bogo: bogouse,
                archivetime: parseInt(archivetime),
                archivedeltime: parseInt(archivedeltime),
                boardeltime: parseInt(boardeltime),
                maxthreads: parseInt(maxthreads),
                // ongoing: false,
                description: description,
                threadimages: threadimageuse,
                replyimages: replyimageuse,
                api: apiuse
            });
        }
        return {success: true};
    },
    delete: async ({request, params})=>{
      await deleteDoc(doc(db, "boards", params.boardname!))
      return {success: true}
    }
} satisfies Actions;
