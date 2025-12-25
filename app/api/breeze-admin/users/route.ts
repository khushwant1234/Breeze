import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        const data = await prisma.roles.findMany();
        return NextResponse.json({data}, {status: 200})
    }catch{
        return NextResponse.json({ error: "Failed to fetch roles",  }, {status: 500})
    }
}