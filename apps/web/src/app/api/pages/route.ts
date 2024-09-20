"use server"

import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from 'next/server';
import { auth } from "../../../../auth";
import { GetPageView } from "../../../db/queries";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const session = await auth();
    if (session) {
        // const data = await GetPageView();
        return NextResponse.json("Success")
    }
    return NextResponse.json("You must be logged in.");
}
