import type { Actions } from "./$types";
// import { FIREBASECONFIG } from "$env/static/private";
// const firebaseconfig = JSON.parse(FIREBASECONFIG);
const firebaseconfig = {
    // yours
};
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, setDoc, query, getDocs, deleteDoc, where, updateDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import type { threadata } from "$lib/store";
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);
export const actions: Actions = {
    default: async({request, params})=>{
        // console.log("here");
        const boardname = params.boardname;
        const currentime = Date.now();
        const formdata = await request.formData();
        const title = formdata.get("title") as string;
        const content = formdata.get("content") as string;
        const fileinp = formdata.get("fileinp") as File;
        const nsfw = formdata.get("nsfw");
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
            let postdata: threadata = {
                title: title,
                content: content,
                replies: 0,
                made: currentime,
                archive: currentime+86400000,
                deltime: currentime+691200000,
                bump: currentime,
                filename: "",
                url: "",
                reported: 7
            };
            
            if(fileinp!= undefined){
            if((fileinp.size != 0) && (fileinp.type.startsWith("image"))){
                postdata.filename = fileinp.name;
                if(nsfw){
                    postdata.reported = 2;
                }else{
                    postdata.reported = 1;
                }
                const storage = getStorage();
                const fullpath: string = boardname+"/"+newpoststr+"/"+fileinp.name;
                const storageref = ref(storage, fullpath);
                await uploadBytes(storageref, fileinp).then(async(snapshot)=>{
                    const fileurl = await getDownloadURL(snapshot.ref);
                    // console.log(fileurl);
                    postdata.url = fileurl;
                })
            }}
    
            await setDoc((threadref), postdata);
            await updateDoc(docref, {
                postnum: newpostnum,
                threadcount: newthreadcount,
                lastactive: currentime
            })
        }
        return({success: true});
        
    }
}