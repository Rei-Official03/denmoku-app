import { NextResponse } from "next/server";

export function middleware(req: Request) {
  const url = new URL(req.url);

  // 保護したいパス（変更後の admin URL）
  if (url.pathname.startsWith("/admin-kanri")) {
    const auth = req.headers.get("authorization");

    // Basic 認証のユーザー名とパスワード
    const username = "denmoku";
    const password = "hama92017";

    const valid = "Basic " + btoa(`${username}:${password}`);

    if (auth !== valid) {
      return new NextResponse("認証が必要です", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Secure Area"',
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin-kanri/:path*"],
};