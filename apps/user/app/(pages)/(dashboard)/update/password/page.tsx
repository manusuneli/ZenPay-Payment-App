import { UpdatePassword } from "../../../../../components/cards/Account Cards/UpdatePassCard";


export default function() 
{

    return (
        <div className="flex justify-center">
            <div>
                <h1 className="mx-4 mt-20 text-3xl ml-20 sm:text-4xl bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 inline-block text-transparent bg-clip-text font-bold mb-6">
                    Update Password
                </h1>
                <div className="mx-10 grid grid-cols-1 gap-10 lg:grid-cols-6 p-2 gap-4">
                    <div className="bg-white min-w-fit lg:min-w-full rounded-3xl col-start-2 col-end-5">
                        <UpdatePassword title="UPDATE PASSWORD"></UpdatePassword>
                    </div>
                </div>
            </div>
            
        </div>
    )
}