import { Card } from "@repo/ui/card";

interface BalanceCardProps {
    amount : number;
    locked : number;
}

interface BalanceCardAccountProps {
    amount : number;
    locked : number;
}


export function BalanceCard({amount, locked} : BalanceCardProps) 
{

    return (
        <div>
            <Card title="Balances">
                <div className="flex justify-between pt-4 border-b border-pink-100">
                    <div className="mx-4 font-semibold mb-1">
                        Unlocked Balance
                    </div>
                    <div className="font-semibold mx-4">
                        {Number(amount) / 100} INR
                    </div>
                </div>
                <div className="flex justify-between pt-4 border-b border-pink-100">
                    <div className="mx-4 font-semibold mb-1">
                        Total Locked Balance
                    </div>
                    <div className="font-semibold mx-4">
                        {Number(locked) / 100} INR
                    </div>
                </div>
                <div className="flex justify-between pt-4 border-b border-pink-100">
                    <div className="mx-4 font-semibold mb-1">
                        Total Balance
                    </div>
                    <div className="font-semibold mx-4">
                        {Number(amount + locked )/ 100} INR
                    </div>
                </div>
            </Card>
        </div>
    )
}
