import B2 from "backblaze-b2";
import { loadEnv } from "../env";

loadEnv();

const b2 = new B2({
  applicationKeyId: process.env.B2_APPLICATION_KEY_ID || "",
  applicationKey: process.env.B2_APPLICATION_KEY || "",
});

let isAuthorized = false;

export const authorizeB2 = async () => {
  if (isAuthorized) {
    return;
  }

  const applicationKeyId = process.env.B2_APPLICATION_KEY_ID;
  const applicationKey = process.env.B2_APPLICATION_KEY;

  if (!applicationKeyId || !applicationKey) {
    throw new Error("Backblaze B2 credentials are not configured.");
  }

  await b2.authorize();
  isAuthorized = true;
};

export const uploadFile = async (fileName: string, buffer: Buffer) => {
  await authorizeB2();

  const bucketId = process.env.B2_BUCKET_ID;
  const bucketName = process.env.B2_BUCKET_NAME;

  if (!bucketId || !bucketName) {
    throw new Error("Backblaze B2 bucket settings are not configured.");
  }

  const response = await b2.getUploadUrl({ bucketId });
  const { uploadUrl, authorizationToken } = response.data;

  const uploadResponse = await b2.uploadFile({
    uploadUrl,
    uploadAuthToken: authorizationToken,
    fileName: `uploads/${Date.now()}-${fileName}`,
    data: buffer,
    onUploadProgress: null,
  });

  const downloadUrl = (b2 as unknown as { downloadUrl?: string }).downloadUrl;

  if (!downloadUrl) {
    throw new Error("Backblaze B2 download URL is unavailable.");
  }

  const publicUrl = `${downloadUrl}/file/${bucketName}/${uploadResponse.data.fileName}`;

  return { url: publicUrl, ...uploadResponse.data };
};
