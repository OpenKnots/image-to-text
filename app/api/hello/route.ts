import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Hello, world!",
    method: "GET",
  });
}

export async function PUT() {
  return NextResponse.json({
    message: "Hello, world!",
    method: "PUT",
  });
}
