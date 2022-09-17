import { atom } from "recoil";


export const LeavingAtom = atom({
    key: "leaving",
    default: false
});

export const indexAtom = atom({
    key: "movieIndex",
    default: 0
});