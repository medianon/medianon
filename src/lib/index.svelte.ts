// place files you want to import through the `$lib` alias in this folder.
export const menu = $state({show: false});
export const session = $state({start: ""});
export const layouturl = $state({url: ""});
export const redirect = $state({url: "/"});
export const redirauth = $state({allow: false});
export const markhist = $state({add: false});
export const images = $state({show: false});
export const nsfw = $state({show: false});
export const bogo = $state({count: 0});
export const boardexport: {
    boardata: boardatatype
} = $state({boardata: {}}) as {
    boardata: boardatatype
};
export const threadexport: {
    threadata: threadatatype
} = $state({threadata: {}}) as {
    threadata: threadatatype
};
export const replyexport: {
    replydata: replydatatype
} = $state({replydata: {}}) as {
    replydata: replydatatype
};
export type boardatatype = {
    title: string,
    established: number,
    entrypass: string,
    adminpass: string,
    threadpass: string,
    replypass: string,
    leaderboard: boolean,
    bogo: boolean,
    boardtype: string,
    threadid: number,
    replynum: number,
    lastactive: number,
    archivetime: number,
    archivedeltime: number,
    boardeltime: number,
    threadcount: number,
    maxthreads: number,
    ongoing: boolean,
    description: string,
    threadimages: boolean,
    replyimages: boolean
}
export type threadatatype = {
    title: string,
    content: string,
    made: number,
    archivetime: number,
    archivedeltime: number,
    replies: number,
    bump: number,
    report: number,
    filename: string,
    url: string
}
export type replydatatype = {
    replynum: number,
    content: string,
    made: number,
    layer: number,
    parent: number,
    replies: number,
    filename: string,
    url: string,
    report: number
}
export type subscription = {
    threadata: threadatatype,
    boardname: string,
    threadid: string,
    archive: boolean
}
export const subscriptions: {
    feed: subscription[]
} = $state({feed: []}) as {
    feed: subscription[]
};
export const tabs: {
    location: string,
    preview: string,
    list: {
        url: string,
        preview: string
    }[]
} = $state({location: "/", preview: "Home", list: []}) as {
    location: string,
    preview: string,
    list: {url: string, preview: string}[]
};
export type historytype = {
    boardname: string,
    threadid: string,
    archive: boolean,
    type: string,
    postdata: threadatatype|replydatatype
}
export const history: {
    posts: historytype[]
} = $state({posts: []}) as {
    posts: historytype[]
};
export type bookmark = {
    boardname: string,
    archive: boolean,
    threadid: string,
    replynum: string,
    preview: string
}
export const bookmarks: {
    list: bookmark[]
} = $state({list: []}) as {list: bookmark[]}