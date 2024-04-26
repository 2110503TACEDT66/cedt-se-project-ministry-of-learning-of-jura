export default function(relativeUrl:string){
    return process.env.BACKEND_URL+relativeUrl;
}