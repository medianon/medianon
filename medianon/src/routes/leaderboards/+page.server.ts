// import { FIREBASECONFIG } from "$env/static/private";
// const firebaseconfig = JSON.parse(FIREBASECONFIG);
const firebaseconfig = {
    // yours
};
// console.log(firebaseconfig);
import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection, query, where, limit, orderBy } from "firebase/firestore";
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = (async () => {
    const boardref = collection(db, "boards");
    const lbquery = query(boardref, where("leaderboard", "==", true), where("postnum", ">", 99), orderBy("postnum", "desc"), limit(100));
    let lbdocs = await getDocs(lbquery);

    let leaderboardata: {
        boardname: string,
        postnum: number,
        boardtype: string,
        established: number
    }[] = [];

    lbdocs.docs.forEach(doc => {
        leaderboardata.push({
            boardname: doc.id,
            postnum: doc.get("postnum"),
            boardtype: doc.get("boardtype"),
            established: doc.get("established")
        })
    })

    return {leaderboardata: leaderboardata}
})satisfies PageServerLoad;