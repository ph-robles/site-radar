import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
 
export async function GET(
  req: NextRequest,
  { params }: any
) {
 
  const id = params.id;
 
  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .eq("id", id)
    .single();
 
  if (error) {
 
    return NextResponse.json(
      { site: null },
      { status: 500 }
    );
 
  }
 
  return NextResponse.json({
    site: data
  });
 
}