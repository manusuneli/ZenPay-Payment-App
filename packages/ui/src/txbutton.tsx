"use client"
import { useRouter } from "next/navigation";



export default function TxButton({href, placeholder}: {
    href: string,
    placeholder: string
})
{
    const router = useRouter();
    return <div className="flex justify-center">
        <button onClick={() => {
            router.push(href);
        }} className="bg-indigo-200 text-indigo-700 rounded-3xl min-w-32 min-h-fit mx-10 px-10 h-10 text-center font-semibold my-8 lg:min-w-60">{placeholder}</button>
    </div>
}