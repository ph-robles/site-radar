import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
 
export async function GET(req: NextRequest) {
 
  const { searchParams } = new URL(req.url);
 
  const termo = searchParams.get("q");
 
  if (!termo || termo.length < 2) {
 
    return NextResponse.json({
      sites: []
    });
 
  }
 
  const { data, error } = await supabase
    .from("sites")
    .select("id,sigla,nome")
    .ilike("sigla", `%${termo}%`)
    .limit(10);
 
  if (error) {
 
    return NextResponse.json({
      sites: []
    });
 
  }
 
  return NextResponse.json({
    sites: data
  });
 
}