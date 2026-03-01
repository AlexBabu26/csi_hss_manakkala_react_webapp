"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = exports.authorizeB2 = void 0;
const backblaze_b2_1 = __importDefault(require("backblaze-b2"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const b2 = new backblaze_b2_1.default({
    applicationKeyId: process.env.B2_APPLICATION_KEY_ID || '',
    applicationKey: process.env.B2_APPLICATION_KEY || '',
});
let isAuthorized = false;
const authorizeB2 = async () => {
    if (!isAuthorized) {
        try {
            await b2.authorize();
            isAuthorized = true;
            console.log('Successfully authorized with Backblaze B2');
        }
        catch (error) {
            console.error('Error authorizing B2:', error);
            throw error;
        }
    }
};
exports.authorizeB2 = authorizeB2;
const uploadFile = async (fileName, buffer) => {
    try {
        await (0, exports.authorizeB2)();
        const bucketId = process.env.B2_BUCKET_ID || '';
        const response = await b2.getUploadUrl({ bucketId });
        const { uploadUrl, authorizationToken } = response.data;
        const uploadResponse = await b2.uploadFile({
            uploadUrl,
            uploadAuthToken: authorizationToken,
            fileName: `uploads/${Date.now()}-${fileName}`,
            data: buffer,
            onUploadProgress: null,
        });
        // Construct the public URL (assumes the bucket is public)
        // Format: https://f00x.backblazeb2.com/file/bucket-name/fileName
        const downloadUrl = b2.downloadUrl; // E.g., https://f000.backblazeb2.com
        const bucketName = process.env.B2_BUCKET_NAME || '';
        const publicUrl = `${downloadUrl}/file/${bucketName}/${uploadResponse.data.fileName}`;
        return { url: publicUrl, ...uploadResponse.data };
    }
    catch (error) {
        console.error('Error uploading to B2:', error);
        throw error;
    }
};
exports.uploadFile = uploadFile;
