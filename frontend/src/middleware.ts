import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/api/:path*"],
};

export function middleware(request: NextRequest) {
  const matches=request.nextUrl.pathname.match(/api\/(.*)?/);
  if(matches==undefined || matches.length<=1){
    throw new Error("invalid path "+request.nextUrl.pathname)
  }
  const path = matches[1];
  return NextResponse.rewrite(
    new URL(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/${path}${request.nextUrl.search}`
    ),
    { request }
  );
}
