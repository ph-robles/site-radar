import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
 
export async function GET(req: NextRequest) {
 
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
 
  if (!q || q.length < 2) {
    return NextResponse.json({ sites: [] });
  }
 
  const termo = q.trim().toUpperCase();
 
  const { data, error } = await supabase
    .from("sites")
    .select("id, sigla, nome")
    .ilike("sigla", `%${termo}%`)
    .order("sigla")
    .limit(10);
 
  if (error) {
 
    console.error(error);
 
    return NextResponse.json({
      sites: []
    });
 
  }
 
  return NextResponse.json({
    sites: data ?? []
  });
 
}