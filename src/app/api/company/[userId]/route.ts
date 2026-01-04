import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const body = await request.json();
    const { userId: userIdString } = await params;
    const userId = parseInt(userIdString, 10);
  } catch (error) {}
}
