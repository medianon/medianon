// import { FIREBASECONFIG } from "$env/static/private";
// const firebaseconfig = JSON.parse(FIREBASECONFIG);
const firebaseconfig = {
    // yours
};
// console.log(firebaseconfig);
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, deleteDoc } from "firebase/firestore";
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);

import type { LayoutServerLoad } from './$types';
import type { boardata } from '$lib/store';

export const load: LayoutServerLoad = (async ({ params }) => {
    const currentime = Date.now();
    const boardname: string = params.boardname;
    const docref = doc(db, "boards", boardname);
    const docsnap = await getDoc(docref);

    if (docsnap.exists()){
        const boardsnapdata = docsnap.data();
        const boardata: boardata = {
            adminpass: boardsnapdata.adminpass,
            archivedeltime: boardsnapdata.archivedeltime,
            archivetime: boardsnapdata.archivetime,
            boardeltime: boardsnapdata.boardeltime,
            boardtype: boardsnapdata.boardtype,
            bogo: boardsnapdata.bogo,
            colourstring: boardsnapdata.colourstring,
            entrypass: boardsnapdata.entrypass,
            established: boardsnapdata.established,
            lastactive: boardsnapdata.lastactive,
            leaderboard: boardsnapdata.leaderboard,
            maxthreads: boardsnapdata.maxthreads,
            ongoing: boardsnapdata.ongoing,
            pinned: boardsnapdata.pinned,
            postnum: boardsnapdata.postnum,
            replypass: boardsnapdata.replypass,
            threadcount: boardsnapdata.threadcount,
            threadpass: boardsnapdata.threadpass,
            title: boardsnapdata.title
        }
        // console.log(boardata);
        if((boardsnapdata.boardtype != "Public")||(boardsnapdata.boardtype != "Special")){
            if (currentime > currentime+boardsnapdata.boardeltime){
                await deleteDoc(doc(db, "boards", boardname));
                return {nothere: boardname};
            }
        }
        return {boardata: boardata};
    }else{
        return {nothere: boardname};
    }
})satisfies LayoutServerLoad;