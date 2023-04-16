import type { Handle } from "@sveltejs/kit"
import { redirect } from "@sveltejs/kit";
export const handle: Handle = async ({event, resolve}) => {
    // if (event.url.origin !== ""){
    //     throw redirect(303, "https://a.b.c")
    // }
    event.locals.inpobj = event.cookies.get("temp");
    event.cookies.delete("temp");//and thats it
    
    return(resolve(event));
}