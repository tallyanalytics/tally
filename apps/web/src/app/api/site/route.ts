"use server"

import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from 'next/server';
import { auth } from "../../../../auth";
import { CreateSite } from "../../../db/queries";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    console.log(req);
    const session = await auth();
    if (session) {
        // const data = await CreateSite(session?.user?.email,);
        return NextResponse.json("Success")
    }
    return NextResponse.json("You must be logged in.");
}
