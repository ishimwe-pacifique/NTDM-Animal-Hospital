import { createCipheriv, createDecipheriv, randomBytes } from "crypto"

export type EncryptedEnvelope = {
  v: 1
  iv: string
  tag: string
  data: string
}

function getKey(): Buffer {
  const raw = process.env.CHAT_ENCRYPTION_KEY
  if (!raw) {
    throw new Error("CHAT_ENCRYPTION_KEY is not set")
  }
  const key = Buffer.from(raw, "base64")
  if (key.length !== 32) {
    throw new Error("CHAT_ENCRYPTION_KEY must decode to exactly 32 bytes (AES-256)")
  }
  return key
}

export function encryptText(plain: string): EncryptedEnvelope {
  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv)
  const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()
  return {
    v: 1,
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    data: data.toString("base64"),
  }
}

export function decryptText(value: string | EncryptedEnvelope | null | undefined): string {
  if (value === null || value === undefined) return ""
  if (typeof value === "string") return value

  const decipher = createDecipheriv("aes-256-gcm", getKey(), Buffer.from(value.iv, "base64"))
  decipher.setAuthTag(Buffer.from(value.tag, "base64"))
  const plain = Buffer.concat([
    decipher.update(Buffer.from(value.data, "base64")),
    decipher.final(),
  ])
  return plain.toString("utf8")
}

export function isEncryptedEnvelope(value: unknown): value is EncryptedEnvelope {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as EncryptedEnvelope).v === 1 &&
    typeof (value as EncryptedEnvelope).data === "string"
  )
}
