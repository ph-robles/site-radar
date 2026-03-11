import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
 
export async function GET(req: NextRequest) {
 
  try {
 
    const { searchParams } = new URL(req.url);
 
    const sigla = searchParams.get("sigla");
 
    if (!sigla) {
      return NextResponse.json(
        { sites: [] },
        { status: 200 }
      );
    }
 
    const termo = sigla.toUpperCase();
 
    const { data, error } = await supabase
      .from("sites")
      .select("*")
      .ilike("sigla", `%${termo}%`)
      .limit(20);
 
    if (error) {
      throw error;
    }
 
    return NextResponse.json({
      sites: data ?? []
    });
 
  } catch (e: any) {
 
    return NextResponse.json(
      {
        sites: [],
        error: e.message
      },
      { status: 500 }
    );
 
  }
}