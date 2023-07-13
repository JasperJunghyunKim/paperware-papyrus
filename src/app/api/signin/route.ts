import { NextResponse } from "next/server";

export interface SignInBody {
  id: string;
  pw: string;
}

export async function POST(req: Request, _: { params: {} }) {
  const body = await req.json();
  const token = "testtoken";

  const response = new NextResponse();
  response.cookies.set("token", token, {
    secure: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  });

  return response;
}
