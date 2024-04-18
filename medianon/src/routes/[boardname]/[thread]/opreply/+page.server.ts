// import { FIREBASECONFIG } from "$env/static/private";
// const firebaseconfig = JSON.parse(FIREBASECONFIG);
const firebaseconfig = {
    // yours
};
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import type { Actions } from "./$types";
import type { postdata } from "$lib/store";
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);

export const actions: Actions = {
    default: async({request, params})=>{
        const boardname = params.boardname;
        const parent = params.thread;
        const formdata = await request.formData();
        const content = formdata.get("content") as string;
        const fileinp = formdata.get("fileinp") as File;
        const nsfw = formdata.get("nsfw");
        const currentime = Date.now();
    
        const boardoc = await getDoc(doc(db, "boards", boardname))
        let newpostnum = 0;
        if (boardoc.exists()){
            const boardata = boardoc.data();
            newpostnum = (boardata.postnum + 1)
        }
        const newpoststr = newpostnum.toString();
        
        const postdata: postdata = {
            postnum: newpostnum,
            content: content,
            made: currentime,
            replies: 0,
            parent: parseInt(parent),
            layer: 1,
            reported: 7,
            filename: "",
            url: ""
        }
        if(fileinp!= undefined){
            if((fileinp.size != 0) && (fileinp.type.startsWith("image"))){
                postdata.filename = fileinp.name;
                if(nsfw){
                    postdata.reported = 2;
                }else{
                    postdata.reported = 1;
                }
                const storage = getStorage();
                const fullpath: string = boardname+"/"+parent+"/"+newpoststr+"/"+fileinp.name;
                const storageref = ref(storage, fullpath);
                await uploadBytes(storageref, fileinp).then(async(snapshot)=>{
                    const fileurl = await getDownloadURL(snapshot.ref);
                    postdata.url = fileurl;
                })
            }}
        
        const opreplyref = doc(db, "boards", boardname, "threads", parent, "replies", newpoststr);
        await setDoc(opreplyref, postdata);
        
        const threadref = doc(db, "boards", boardname, "threads", parent);
        await updateDoc(threadref, {
            replies: increment(1),
            bump: currentime,
        });

        const boardref = doc(db, "boards", boardname);
        await updateDoc(boardref, {
            postnum: newpostnum,
            lastactive: currentime,
        })
        return({success: true});
    }
}