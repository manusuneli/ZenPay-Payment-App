import { MpinCard } from "../../../../../components/cards/Account Cards/MpinCard";



export default function() 
{

    return (
        <div className="flex justify-center">
            <div className="mx-10 grid grid-cols-1 gap-10 lg:grid-cols-6 p-2 gap-4">
                <div className="bg-white min-w-fit lg:min-w-full rounded-3xl col-start-2 col-end-5">
                    <MpinCard title="UPDATE MPIN" type="update"></MpinCard>
                </div>
            </div>
        </div>
    )
}