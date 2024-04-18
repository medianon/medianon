import type { Actions } from "@sveltejs/kit";
// import { FIREBASECONFIG } from "$env/static/private";
// const firebaseconfig = JSON.parse(FIREBASECONFIG);
const firebaseconfig = {
    // yours
};
// console.log(firebaseconfig);
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);

export const actions: Actions = {
    default: async({request, params}) => {
        const formdata = await request.formData();
        const boardname = params.boardname!;
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
            apass: string,
            tpass: string,
            rpass: string
        } = JSON.parse(passwordstring);
        const maxthreads = parseInt(formdata.get("maxthreads")!.toString());
        let pinned = formdata.get("pinned")?.toString();
        const checkref = doc(db, "boards", boardname);
        const checkdoc = await getDoc(checkref);
        if (checkdoc.exists()){
            await updateDoc(doc(db, "boards", boardname),{
                title: title,
                // boardtype: "Custom",
                entrypass: passwords.epass,
                adminpass: passwords.apass,
                threadpass: passwords.tpass,
                replypass: passwords.rpass,
                maxthreads: maxthreads,
                // ongoing: false,
                leaderboard: leaderboarduse,
                bogo: bogouse,
                pinned: pinned
            });
        }
        return {success: true}
    }
}