import { NextRequest, NextResponse } from "next/server"

export const GET = async(req:NextRequest)=>{
    NextResponse.json("suii",req)
}