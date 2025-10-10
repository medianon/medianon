import type { Actions } from "@sveltejs/kit";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { FIREBASE } from '$env/static/private';
import bcrypt from "bcryptjs";
import type { boardatatype } from "$lib/index.svelte";
const firebaseconfig = JSON.parse(FIREBASE);
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);

export const actions = {
    default: async ({request, params}) => {
        const currentime = Date.now();
        const formdata = await request.formData();
        const boardname: string = params.boardname as string;
        const title = formdata.get("title")?.toString();
        const leaderboard = formdata.get("leaderboard");
        let leaderboarduse: boolean = false;
        if (leaderboard != null){
            leaderboarduse = true;
        }
        const bogo = formdata.get("bogo");
        let bogouse: boolean = false;
        if (bogo != null){
            bogouse = true;
        }
        let entry = formdata.get("entry")!.toString();
        let admin = formdata.get("admin")!.toString();
        if(entry!=""){
            entry = await bcrypt.hash(entry, 3);
        }
        if(admin!=""){
            admin = await bcrypt.hash(admin, 3);
        }
        const boardata: boardatatype = {
            title: title,
            established: currentime,
            entrypass: entry,
            adminpass: admin,
            threadpass: "",
            replypass: "",
            leaderboard: leaderboarduse,
            bogo: bogouse,
            boardtype: "Custom",
            threadid: 0,
            replynum: 0,
            lastactive: currentime,
            archivetime: 86400000,
            archivedeltime: 604800000,
            boardeltime: 2592000000,
            threadcount: 0,
            maxthreads: 50,
            ongoing: false,
            description: "",
            threadimages: false,
            replyimages: false
        } as boardatatype;
        const checkref = doc(db, "boards", boardname);
        const checkdoc = await getDoc(checkref);
        if (checkdoc.exists()){
            return {success: true};
        } else {
            await setDoc(doc(db, "boards", boardname), boardata);
        }
        return {success: true};
    }
} satisfies Actions;