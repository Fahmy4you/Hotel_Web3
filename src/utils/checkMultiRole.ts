import { NextResponse } from "next/server";

export const checkMultipleRoles = (
  payload: { role: number },
  permittedRoles: number[]
) => {
  if (!payload || typeof payload.role !== "number") {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  if (!permittedRoles.includes(payload.role)) {
    return NextResponse.json(
      { message: "Access denied. Insufficient privileges." },
      { status: 403 }
    );
  }

  return undefined;
};
