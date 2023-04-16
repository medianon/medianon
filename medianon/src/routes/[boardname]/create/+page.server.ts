import { FIREBASECONFIG } from "$env/static/private";
const firebaseconfig = JSON.parse(FIREBASECONFIG);
// console.log(firebaseconfig);
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, setDoc, query, getDocs, deleteDoc, where, updateDoc } from "firebase/firestore";
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({locals, params}) => {
    const boardname = params.boardname;
    const temp = JSON.parse(locals.inpobj);
    const currentime = Date.now();
    // console.log(temp);
    const docref = doc(db, "boards", boardname)
    const docsnap = await getDoc(docref);
    if(docsnap.exists()){
        const boardata = docsnap.data();
        let newthreadcount: number = (boardata.threadcount + 1);
        const newpostnum: number = (boardata.postnum + 1);
        const newpoststr = newpostnum.toString();

        if (boardata.threadcount == boardata.maxthreads){
            const delthreadref = collection(db, "boards", boardname, "threads");
            const delthreadquery = query(delthreadref, where("archive", ">", currentime));
            const delthreadsnap = await getDocs(delthreadquery);

            let bumptimes: {threadid: string, bump: number}[] = [];
            delthreadsnap.docs.forEach((doc)=>{
                const threadata = doc.data();
                bumptimes.push({
                    threadid: doc.id,
                    bump: threadata.bump
                })
            })

            bumptimes = bumptimes.sort((a, b) => 
                (a.bump < b.bump)? -1 : 1
            );
            let rip = bumptimes[0];
            await deleteDoc(doc(db, "boards", boardname, "threads", rip.threadid))
            newthreadcount -= 1;
        }
        
        const threadref = doc(db, "boards", boardname, "threads", newpoststr);
        await setDoc((threadref),{
            title: temp.title,
            content: temp.content,
            replies: 0,
            made: temp.made,
            archive: temp.archive,
            deltime: temp.delete,
            bump: temp.made,
            boxes: temp.boxes
        });
        
        if (boardata.boardtype == "Public"){
            await updateDoc(docref, {
                postnum: newpostnum,
                threadcount: newthreadcount,
                lastactive: temp.made,
            })
        } else {
            await updateDoc(docref, {
                postnum: newpostnum,
                threadcount: newthreadcount,
                lastactive: temp.made,
                delete: (temp.made + 2592000000),
            })
        }
    }
}