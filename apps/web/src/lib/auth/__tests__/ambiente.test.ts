import { describe, expect, it } from "vitest";
import { ehAmbienteDev } from "../ambiente";

describe("ehAmbienteDev", () => {
  it("bloqueia estritamente domínios de produção", () => {
    expect(ehAmbienteDev("calafrio.wozniack.com")).toBe(false);
    expect(ehAmbienteDev("app.wozniack.com")).toBe(false);
  });

  it("permite localhost quando NODE_ENV for development", () => {
    const env = process.env as Record<string, string | undefined>;
    const prev = env.NODE_ENV;
    env.NODE_ENV = "development";
    expect(ehAmbienteDev("localhost:3001")).toBe(true);
    expect(ehAmbienteDev("127.0.0.1:3001")).toBe(true);
    env.NODE_ENV = prev;
  });

  it("bloqueia se NODE_ENV for production mesmo em localhost", () => {
    const env = process.env as Record<string, string | undefined>;
    const prev = env.NODE_ENV;
    env.NODE_ENV = "production";
    expect(ehAmbienteDev("localhost:3001")).toBe(false);
    env.NODE_ENV = prev;
  });
});
