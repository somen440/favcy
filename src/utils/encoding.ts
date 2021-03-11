export function toBase64(v: string): string {
  return Buffer.from(v).toString("base64");
}

export function fromBase64(v: string): string {
  return Buffer.from(v, "base64").toString("utf8");
}
