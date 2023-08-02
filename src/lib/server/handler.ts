import { z } from "zod";
import { NextResponse } from "next/server";
import { ConflictError, NotFoundError } from "./error";

interface Context {
  params: any;
}

export const handleApi =
  <T>(fn: (req: Request, context: Context) => Promise<T>) =>
  async (req: Request, context: Context) => {
    try {
      return new NextResponse(JSON.stringify(await fn(req, context)));
    } catch (e) {
      if (e instanceof z.ZodError) {
        return new NextResponse(
          JSON.stringify({
            message: "요청에 유효하지 않은 데이터가 포함되었습니다.",
            data: e.issues,
          }),
          {
            status: 400,
          }
        );
      } else if (e instanceof NotFoundError) {
        return new NextResponse(
          JSON.stringify({
            message: "존재하지 않는 데이터입니다.",
            data: e.message,
          }),
          {
            status: 404,
          }
        );
      } else if (e instanceof ConflictError) {
        return new NextResponse(JSON.stringify({
            message: e.message,
            data: e.message,
          }),
          {
            status: 409,
          }
        );
      }
    }
  };
