import { FIREBASECONFIG } from "$env/static/private";
const firebaseconfig = JSON.parse(FIREBASECONFIG);
// console.log(firebaseconfig);
import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({locals, params}) => {
    const temp = JSON.parse(locals.inpobj);
    // console.log(temp);
    
    await updateDoc(doc(db, "boards", params.boardname),{
        title: temp.title,
        entrypass: temp.entrypass,
        adminpass: temp.adminpass,
        leaderboard: temp.leaderboard,
        bogo: temp.bogo
    });
}