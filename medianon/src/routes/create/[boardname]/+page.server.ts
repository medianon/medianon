import { FIREBASECONFIG } from "$env/static/private";
const firebaseconfig = JSON.parse(FIREBASECONFIG);
// console.log(firebaseconfig);
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({locals, params}) => {
    const temp = JSON.parse(locals.inpobj);
    // console.log(temp);
    
    const checkref = doc(db, "boards", params.boardname);
    const checkdoc = await getDoc(checkref);
    if (checkdoc.exists()){
        return {tooslowlol: true}
    } else {
        await setDoc(doc(db, "boards", params.boardname),{
            title: temp.title,
            boardtype: temp.boardtype,
            entrypass: temp.entrypass,
            adminpass: temp.adminpass,
            lastactive: temp.lastactive,
            postnum: 0,
            maxthreads: 100,
            threadcount: 0,
            ongoing: false,
            delete: (Date.now() + 2592000000),
            established: Date.now(),
            leaderboard: temp.leaderboard,
            bogo: temp.bogo
        });
    }
}