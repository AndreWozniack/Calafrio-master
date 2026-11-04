import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const endpoint = process.env.R2_ENDPOINT;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME || "calafrio-assets";
const publicUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");

let s3Client: S3Client | null = null;

export function obterClienteR2(): S3Client | null {
  if (s3Client) return s3Client;
  if (!endpoint || !accessKeyId || !secretAccessKey) return null;

  s3Client = new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return s3Client;
}

export async function uploadImagemR2(params: {
  buffer: Buffer;
  nomeArquivoOriginal: string;
  mimeType: string;
  pasta?: string;
}): Promise<string | null> {
  const cliente = obterClienteR2();
  if (!cliente) {
    console.warn("⚠️ Cloudflare R2 não configurado nas variáveis de ambiente.");
    return null;
  }

  const extensao = params.nomeArquivoOriginal.split(".").pop() || "png";
  const pasta = params.pasta ? `${params.pasta}/` : "retratos/";
  const key = `${pasta}investigador-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extensao}`;

  await cliente.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: params.buffer,
      ContentType: params.mimeType,
    }),
  );

  if (publicUrl) {
    return `${publicUrl}/${key}`;
  }

  // Fallback caso não tenha domínio público customizado configurado
  return `${endpoint}/${bucketName}/${key}`;
}
