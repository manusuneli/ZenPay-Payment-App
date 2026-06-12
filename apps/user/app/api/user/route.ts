import { getServerSession } from "next-auth"
import { NextResponse } from "next/server";
import { NEXT_AUTH } from "../../lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

// This Api route shows is user logged in or not 

export async function GET(req: NextApiRequest, res: NextApiResponse) {
        const session = await getServerSession(NEXT_AUTH);

    if(session?.user)
    {
        return NextResponse.json({
            msg: session.user
        })
    }
    
    return NextResponse.json({
        msg: "You are not logged in"
    },
    {
        status: 403
    })
}

