import { Request } from "express";

export type RequestWithBody<T> = Request<EmptyObject, unknown, T, unknown>;

export type RequestWithParams<T> = Request<T, unknown, unknown, unknown>;
export type RequestWithParamsAndBody<P, B> = Request<P, unknown, B, unknown>;
export type RequestWithParamsAndQuery<P, Q> = Request<P, unknown, unknown, Q>;
export type RequestWithQuery<Q> = Request<EmptyObject, unknown, unknown, Q>;
type EmptyObject = Record<string, never>;
