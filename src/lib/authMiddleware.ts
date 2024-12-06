import { NextRequest, NextResponse } from "next/server";

export function verifyRole(requiredRole: string) {
  return async (req: NextRequest) => {
    const user = req.cookies.get("user")?.value;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { role } = JSON.parse(user);
    if (role !== requiredRole) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    return NextResponse.next();
  };
}
