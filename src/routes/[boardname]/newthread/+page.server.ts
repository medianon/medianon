import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, collection, query, where, increment } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { FIREBASE } from '$env/static/private';
import type { Actions } from "./$types";
import type { boardatatype, threadatatype } from "$lib/index.svelte";
const firebaseconfig = JSON.parse(FIREBASE);
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);

export const actions: Actions = {
    default: async ({request, params}) => {
        const boardname: string = params.boardname;
        const currentime = Date.now();
        const formdata = await request.formData();
        const title = formdata.get("title") as string;
        const content = formdata.get("content") as string;
        const fileinp = formdata.get("fileinp") as File;
        const nsfw = formdata.get("nsfw");
        const boardref = doc(db, "boards", boardname)
        const boardsnap = await getDoc(boardref);
        if(boardsnap.exists()){
            const boardata = boardsnap.data() as boardatatype;
            let newthreadcount: number = (boardata.threadcount + 1);
            const newthreadid: number = (boardata.threadid + 1);
            const newthreadstr = newthreadid.toString();
            let archivetime: number = currentime;
            archivetime += boardata.archivetime;
            let archivedeltime: number = archivetime;
            archivedeltime += boardata.archivedeltime;
            if (boardata.threadcount == boardata.maxthreads){
                const delthreadref = collection(db, "boards", boardname, "threads");
                const delthreadquery = query(delthreadref, where("archivetime", ">", currentime));
                const delthreadsnap = await getDocs(delthreadquery);
                let idbump: {threadid: string, bump: number}[] = [];
                delthreadsnap.docs.forEach((doc)=>{
                    const threadata = doc.data();
                    idbump.push({
                        threadid: doc.id,
                        bump: threadata.bump
                    })
                })
                idbump = idbump.sort((a, b) => 
                    (a.bump < b.bump)? -1 : 1
                );
                let rip = idbump[0].threadid;
                await deleteDoc(doc(db, "boards", boardname, "threads", rip));
                newthreadcount -= 1;
            }
            
            const threadref = doc(db, "boards", boardname, "threads", newthreadstr);
            let threadata: threadatatype = {
                title: title,
                content: content,
                replies: 0,
                made: currentime,
                archivetime: archivetime,
                archivedeltime: archivedeltime,
                bump: currentime,
                filename: "",
                url: "",
                report: 5
            };
            if(fileinp!= undefined){
            if((fileinp.size != 0) && (fileinp.type.startsWith("image"))){
                threadata.filename = fileinp.name;
                if(nsfw){
                    threadata.report = 1;
                }else{
                    threadata.report = 0;
                }
                const storage = getStorage();
                const fullpath: string = boardname+"/"+newthreadstr+"/"+fileinp.name;
                const storageref = ref(storage, fullpath);
                await uploadBytes(storageref, fileinp).then(async(snapshot)=>{
                    const fileurl = await getDownloadURL(snapshot.ref);
                    threadata.url = fileurl;
                })
            }}
    
            await setDoc((threadref), threadata);
            await updateDoc(boardref, {
                threadid: increment(1),
                threadcount: newthreadcount,
                lastactive: currentime
            })
        }
    }
};