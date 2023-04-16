import { FIREBASECONFIG } from "$env/static/private";
const firebaseconfig = JSON.parse(FIREBASECONFIG);
// console.log(firebaseconfig);
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({locals, params}) => {
    const temp = JSON.parse(locals.inpobj);
    const boardname = params.boardname;
    const threadid = params.thread;
    // const postid = params.post;
    // const currentime = Date.now();
    
    const boardoc = await getDoc(doc(db, "boards", boardname))
    let newpostnum = 0;
    if (boardoc.exists()){
        const boardata = boardoc.data();
        newpostnum = (boardata.postnum + 1)
    }
    let newpoststr = newpostnum.toString();
    
    const postdata = {
        postnum: newpostnum,
        content: temp.content,
        made: temp.made,
        boxes: temp.boxes,
        replies: 0,
        parent: temp.parent,
        layer: temp.layer
    }
    
    const newreplyref = doc(db, "boards", boardname, "threads", threadid, "replies", newpoststr);
    await setDoc(newreplyref, postdata);
    
    const threadref = doc(db, "boards", boardname, "threads", threadid);
    await updateDoc(threadref, {
        replies: increment(1),
        bump: temp.made,
    });

    const replyid = postdata.parent.toString();
    const replycountref = doc(db, "boards", boardname, "threads", threadid, "replies", replyid);
    await updateDoc(replycountref, {
        replies: increment(1)
    })
    
    const boardref = doc(db, "boards", boardname);
    if (boardoc.exists()){
        const boardata = boardoc.data();
        if (boardata.boardtype == "Public"){
            await updateDoc(boardref, {
                postnum: newpostnum,
                lastactive: temp.made,
            })
        } else {
            await updateDoc(boardref, {
                postnum: newpostnum,
                lastactive: temp.made,
                delete: (temp.made + 2592000000),
            })
        }
    }
}