import { readUpload } from "@/lib/uploads";

/** Servește imaginile urcate din panou (salvate pe disc in data/uploads). */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  const found = readUpload(file);
  if (!found) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(found.body), {
    headers: {
      "Content-Type": found.type,
      "Content-Length": String(found.body.length),
      // Numele contine timestamp, deci un fisier nu isi schimba continutul.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
