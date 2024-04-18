import type { Actions } from "@sveltejs/kit";
// import { FIREBASECONFIG } from "$env/static/private";
// const firebaseconfig = JSON.parse(FIREBASECONFIG);
const firebaseconfig = {
    // yours
};
// console.log(firebaseconfig);
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);

export const actions: Actions = {
    default: async ({request}) => {
        const currentime = Date.now();
        const formdata = await request.formData();
        const boardname = formdata.get("boardname")!.toString();
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
        const passwordstring = formdata.get("passwords")!.toString();
        const passwords: {
            epass: string,
            apass: string
        } = JSON.parse(passwordstring);
        const checkref = doc(db, "boards", boardname);
        const checkdoc = await getDoc(checkref);
        if (checkdoc.exists()){
            return {success: true};
        } else {
            await setDoc(doc(db, "boards", boardname),{
                adminpass: passwords.apass,
                archivetime: false,
                archivedeltime: false,
                boardeltime: 2592000000,
                boardtype: "Custom",
                bogo: bogouse,
                colourstring: "",
                entrypass: passwords.epass,
                established: currentime,
                lastactive: currentime,
                leaderboard: leaderboarduse,
                maxthreads: 100,
                ongoing: false,
                pinned: "",
                postnum: 0,
                replypass: "",
                threadcount: 0,
                threadpass: "",
                title: title
            });
        }
        return {success: true};
    }
}