export const makeImagePath = (id: string, format?: string) => {
    return `https://image.tmdb.org/t/p/${format?format:"original"}/${id}`
}

export enum types {
    "now" = "On_Air",
    "popular" = "Popular", 
}