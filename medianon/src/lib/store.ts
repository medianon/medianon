import { writable, readable } from "svelte/store";

export const userinp = writable("");

export const status = writable(false);
export const session = writable("");
export const defaultcolours = readable({
    userinp: false,
    background: "rgb(102, 117, 116)",
    navbackground: "rgb(102, 117, 116)",
    menulines: "rgb(187, 198, 206)",
    text: "hsl(205deg, 16%, 77%)",
    buttons: "rgb(84, 88, 90)",
    btntxt: "rgb(187, 198, 206)",
    btnhvr: "rgb(65, 68, 70)",
    inpbackground: "#293947",
    ui2: "rgb(84, 88, 90)",
    arrows: "#293947",
    subscribe: "#293947",
    bookmark: "rgb(225, 225, 88)",
    tabs: "rgb(102, 117, 116)",
    history: "rgb(102, 117, 116)"
});
export const threadsort = writable("Bump (Default)");
export const firstsort = writable("Most recent (Default)")
export const currentsort = writable("Most recent (Default)");
export const nextsort = writable("Most recent (Default)");

export const searchdata = writable("");

export const usebogo = writable(false);
export const bogocount = writable(0);

export type threadata = {
    title: string,
    content: string,
    made: number,
    bump: number,
    archive: number,
    boxes: number,
    replies: number,
    deltime: number
};
export const subscriptions = writable<{
    boardname: string,
    threadid: number,
    threadata: threadata
}[]>([]);
export const showtabs = writable(false);
export const tabdata = writable<any>({boardname: ""});
export type tab = {
    boardname: string,
    threadid: string,
    postnum: string,
    archive: boolean
}
export const tabs = writable<tab[]>([]);
export const showhistory = writable(false);
export const usehistory = writable(false);
export const historylength = writable(0);
type fullpostdata = {
    archive: boolean,
    boardname: string,
    threadid: string,
    postdata: postdata
}
export const history = writable<fullpostdata[]>([]);

export const speed = writable(200);

export const bookmarks = writable<string[]>([]);

export const boardnamexport = writable("");
export type boardata = {
    adminpass: string,
    boardtype: string,
    entrypass: string,
    lastactive: number,
    ongoing: boolean,
    title: string
}
export const boardataexport = writable<boardata>();

export const createtype = writable("");

export const threadidexport = writable("");

export type postdata = {
    postnum: number,
    content: string,
    made: number,
    boxes: number,
    replies: number,
    parent: number,
    layer: number
};

export const newlayer = writable(0);
export const newparent = writable(0);

export const returl = writable("");