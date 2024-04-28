"use client"
import useSession from "@/hooks/useSession";
import { useRouter } from "next/navigation";

export default function(){
    const {session,deleteSession} = useSession();
    const router = useRouter();
    async function onClickLogout(){
        const res = await fetch("/api/auth/logout",{
            method:"GET"
        })
        deleteSession();
        router.back();
        router.refresh();
    }
    return (
        <main className="flex w-full align-center justify-center absolute top-1/2 transform -translate-y-1/2">
            <div className="bg-white p-2 rounded-2xl text-black flex flex-col items-center justify-center">
                <p>To Sign Out Click The Button Below</p>
                <button onClick={onClickLogout} className="bg-[lightblue] bg-opacity-70 hover:bg-opacity-100 transition-all ease-in-out delay-200 rounded-2xl p-2">Sign Out</button>
            </div>
        </main>
    )
}