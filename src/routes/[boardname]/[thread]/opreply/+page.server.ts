import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { FIREBASE } from '$env/static/private';
import type { Actions } from "./$types";
import type { replydatatype, boardatatype } from "$lib/index.svelte";
const firebaseconfig = JSON.parse(FIREBASE);
const app = initializeApp(firebaseconfig);
const db = getFirestore(app);

export const actions: Actions = {
    default: async({request, params})=>{
        const boardname = params.boardname;
        const parent = params.thread;
        const formdata = await request.formData();
        const content = formdata.get("content")!.toString();
        const fileinp = formdata.get("fileinp") as File;
        const nsfw = formdata.get("nsfw");
        const currentime = Date.now();
        const boardoc = await getDoc(doc(db, "boards", boardname))
        let newreplynum = 0;
        if (boardoc.exists()){
            const boardata: boardatatype = boardoc.data() as boardatatype;
            newreplynum = (boardata.replynum + 1)
        }
        const newreplystr = newreplynum.toString();
        
        const replydata: replydatatype = {
            replynum: newreplynum,
            content: content,
            made: currentime,
            replies: 0,
            parent: parseInt(parent),
            layer: 1,
            report: 5,
            filename: "",
            url: ""
        }
        if(fileinp!= undefined){
        if((fileinp.size != 0) && (fileinp.type.startsWith("image"))){
            replydata.filename = fileinp.name;
            if(nsfw){
                replydata.report = 1;
            }else{
                replydata.report = 0;
            }
            const storage = getStorage();
            const fullpath: string = boardname+"/"+parent+"/"+newreplystr+"/"+fileinp.name;
            const storageref = ref(storage, fullpath);
            await uploadBytes(storageref, fileinp).then(async(snapshot)=>{
                const fileurl = await getDownloadURL(snapshot.ref);
                replydata.url = fileurl;
            })
        }}

        const opreplyref = doc(db, "boards", boardname, "threads", parent, "replies", newreplystr);
        await setDoc(opreplyref, replydata);
        
        const threadref = doc(db, "boards", boardname, "threads", parent);
        await updateDoc(threadref, {
            replies: increment(1),
            bump: currentime,
        });

        const boardref = doc(db, "boards", boardname);
        await updateDoc(boardref, {
            replynum: newreplynum,
            lastactive: currentime,
        })
        return({success: true});
    }
}