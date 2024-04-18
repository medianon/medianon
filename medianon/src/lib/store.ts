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
export const firstsort = writable("Oldest (Default)")
export const currentsort = writable("Oldest (Default)");
export const nextsort = writable("Oldest (Default)");

export const searchdata = writable("");

export const usebogo = writable(false);
export const bogocount = writable(0);

export type threadata = {
    archive: number,
    title: string,
    content: string,
    made: number,
    bump: number,
    replies: number,
    deltime: number,
    reported: number,
    filename: string,
    url: string
};

export const threadataexport = writable<threadata>();

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

export type boardata = {
    archivetime: false,
    archivedeltime: false,
    boardeltime: number,
    adminpass: string,
    boardtype: string,
    bogo: boolean,
    colourstring: "",
    entrypass: string,
    established: number,
    lastactive: number,
    leaderboard: boolean,
    maxthreads: number,
    ongoing: boolean,
    pinned: string,
    postnum: number,
    replypass: string,
    threadcount: number,
    threadpass: string,
    title: string
}
export const boardataexport = writable<boardata>({
    adminpass: "",
    archivedeltime: false,
    archivetime: false,
    boardtype: "",
    bogo: false,
    boardeltime: 0,
    colourstring: "",
    entrypass: "",
    established: 0,
    lastactive: 0,
    leaderboard: false,
    maxthreads: 0,
    ongoing: false,
    pinned: "",
    postnum: 0,
    replypass: "",
    threadcount: 0,
    threadpass: "",
    title: ""
});

export const createtype = writable("");

export const threadidexport = writable("");

export type postdata = {
    content: string,
    filename: string,
    layer: number,
    made: number,
    parent: number,
    postnum: number,
    replies: number,
    reported: number,
    url: string
};

export const postdataexport = writable<postdata>();

export const newlayer = writable(0);
export const newparent = writable(0);

export const returl = writable("");

export type report = {
    docid: string,
    boardname: string,
    threadid: string,
    postnum: string | undefined,
    url: string,
    filename: string,
    reason: string,
    reportrefid: string
}

export const showmedia = writable(false);
export const shownsfw = writable(false);

export const reportarchive = writable(false);