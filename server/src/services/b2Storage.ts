import B2 from 'backblaze-b2';
import { config } from 'dotenv';
import crypto from 'crypto';

config();

class B2StorageService {
  private b2: B2;
  private bucketId: string;
  private bucketName: string;
  private isInitialized: boolean = false;
  private authToken: string = '';
  private downloadUrl: string = '';
  private uploadUrl: string = '';
  private uploadAuthToken: string = '';

  constructor() {
    this.b2 = new B2({
      applicationKeyId: process.env.B2_APPLICATION_KEY_ID || '',
      applicationKey: process.env.B2_APPLICATION_KEY || '',
    });
    this.bucketId = process.env.B2_BUCKET_ID || '';
    this.bucketName = process.env.B2_BUCKET_NAME || 'csi-manakkala-uploads';
  }

  private async initialize() {
    if (this.isInitialized) return;

    try {
      // Authorize account
      const authResponse = await this.b2.authorize();
      this.authToken = authResponse.data.authorizationToken;
      this.downloadUrl = authResponse.data.downloadUrl;

      // Get upload URL
      const uploadUrlResponse = await this.b2.getUploadUrl({
        bucketId: this.bucketId,
      });
      this.uploadUrl = uploadUrlResponse.data.uploadUrl;
      this.uploadAuthToken = uploadUrlResponse.data.authorizationToken;

      this.isInitialized = true;
      console.log('✅ Backblaze B2 initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Backblaze B2:', error);
      throw error;
    }
  }

  /**
   * Upload a base64 image to B2
   */
  async uploadBase64Image(base64Data: string, fileName?: string): Promise<string> {
    await this.initialize();

    try {
      // Extract base64 data (remove data:image/...;base64, prefix if present)
      const base64Match = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
      let imageBuffer: Buffer;
      let contentType: string;

      if (base64Match) {
        const imageType = base64Match[1];
        const base64String = base64Match[2];
        imageBuffer = Buffer.from(base64String, 'base64');
        contentType = `image/${imageType}`;
      } else {
        // Assume it's already pure base64
        imageBuffer = Buffer.from(base64Data, 'base64');
        contentType = 'image/jpeg';
      }

      // Generate unique filename if not provided
      const uniqueFileName = fileName || `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.jpg`;
      const filePath = `uploads/${uniqueFileName}`;

      // Upload to B2
      const uploadResponse = await this.b2.uploadFile({
        uploadUrl: this.uploadUrl,
        uploadAuthToken: this.uploadAuthToken,
        fileName: filePath,
        data: imageBuffer,
        contentType: contentType,
      });

      // Construct download URL
      const downloadUrl = `${this.downloadUrl}/file/${this.bucketName}/${filePath}`;
      
      console.log(`✅ File uploaded to B2: ${downloadUrl}`);
      console.log(`ℹ️  Note: Bucket is private. File ID: ${uploadResponse.data.fileId}`);
      return downloadUrl;
    } catch (error: any) {
      // If upload URL expired, refresh and retry once
      if (error.response?.status === 401) {
        console.log('⚠️ Upload token expired, refreshing...');
        this.isInitialized = false;
        await this.initialize();
        return this.uploadBase64Image(base64Data, fileName);
      }
      console.error('❌ Failed to upload to B2:', error);
      throw error;
    }
  }

  /**
   * Upload multiple base64 images
   */
  async uploadMultipleBase64Images(base64Array: string[]): Promise<string[]> {
    const uploadPromises = base64Array.map(base64Data => this.uploadBase64Image(base64Data));
    return Promise.all(uploadPromises);
  }

  /**
   * Delete a file from B2
   */
  async deleteFile(fileUrl: string): Promise<void> {
    await this.initialize();

    try {
      // Extract filename from URL
      const urlParts = fileUrl.split('/');
      const fileName = urlParts.slice(urlParts.indexOf(this.bucketName) + 1).join('/');

      // Get file info first
      const fileList = await this.b2.listFileNames({
        bucketId: this.bucketId,
        startFileName: fileName,
        maxFileCount: 1,
      });

      if (fileList.data.files.length > 0 && fileList.data.files[0].fileName === fileName) {
        const fileId = fileList.data.files[0].fileId;

        // Delete file
        await this.b2.deleteFileVersion({
          fileId: fileId,
          fileName: fileName,
        });

        console.log(`✅ File deleted from B2: ${fileName}`);
      }
    } catch (error) {
      console.error('❌ Failed to delete from B2:', error);
      // Don't throw - allow deletion to proceed even if B2 delete fails
    }
  }

  /**
   * Generate authorized download URL for private bucket files
   */
  async getAuthorizedUrl(fileUrl: string, validDurationInSeconds: number = 3600): Promise<string> {
    await this.initialize();

    try {
      // Extract filename from URL
      const urlParts = fileUrl.split('/');
      const fileName = urlParts.slice(urlParts.indexOf(this.bucketName) + 1).join('/');

      // Generate download authorization token
      const authResponse = await this.b2.getDownloadAuthorization({
        bucketId: this.bucketId,
        fileNamePrefix: fileName,
        validDurationInSeconds: validDurationInSeconds,
      });

      const authToken = authResponse.data.authorizationToken;
      
      // Return URL with authorization token
      return `${fileUrl}?Authorization=${authToken}`;
    } catch (error) {
      console.error('❌ Failed to generate authorized URL:', error);
      throw error;
    }
  }

  /**
   * Download file from B2 and return buffer (for proxying)
   */
  async downloadFile(fileUrl: string): Promise<Buffer> {
    await this.initialize();

    try {
      // Get authorized URL
      const authorizedUrl = await this.getAuthorizedUrl(fileUrl, 60); // 60 seconds validity

      // Fetch the file
      const response = await fetch(authorizedUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      console.error('❌ Failed to download file from B2:', error);
      throw error;
    }
  }

  /**
   * Upload a file buffer to B2
   */
  async uploadFile(fileName: string, fileBuffer: Buffer, mimeType: string): Promise<string> {
    await this.initialize();

    try {
      // Generate unique filename
      const uniqueFileName = `${Date.now()}-${fileName}`;
      const filePath = `uploads/${uniqueFileName}`;

      // Upload to B2
      const uploadResponse = await this.b2.uploadFile({
        uploadUrl: this.uploadUrl,
        uploadAuthToken: this.uploadAuthToken,
        fileName: filePath,
        data: fileBuffer,
        contentType: mimeType,
      });

      // For private buckets, use the friendly URL which will work with authorization
      // The frontend should handle authorization if needed, or we can make the bucket public
      const downloadUrl = `${this.downloadUrl}/file/${this.bucketName}/${filePath}`;
      
      console.log(`✅ File uploaded to B2: ${downloadUrl}`);
      console.log(`ℹ️  Note: Bucket is private. File ID: ${uploadResponse.data.fileId}`);
      return downloadUrl;
    } catch (error: any) {
      // If upload URL expired, refresh and retry once
      if (error.response?.status === 401) {
        console.log('⚠️ Upload token expired, refreshing...');
        this.isInitialized = false;
        await this.initialize();
        return this.uploadFile(fileName, fileBuffer, mimeType);
      }
      console.error('❌ Failed to upload to B2:', error);
      throw error;
    }
  }

  /**
   * Check if B2 is properly configured
   */
  isConfigured(): boolean {
    return !!(
      process.env.B2_APPLICATION_KEY_ID &&
      process.env.B2_APPLICATION_KEY &&
      process.env.B2_BUCKET_ID
    );
  }
}

// Export singleton instance
export const b2Storage = new B2StorageService();

// Export standalone functions for easier import
export const isB2Configured = () => b2Storage.isConfigured();
export const uploadFileToB2 = (fileName: string, fileBuffer: Buffer, mimeType: string) => 
  b2Storage.uploadFile(fileName, fileBuffer, mimeType);
export const deleteFileFromB2 = (fileUrl: string) => b2Storage.deleteFile(fileUrl);
export const getAuthorizedB2Url = (fileUrl: string, validDurationInSeconds?: number) => 
  b2Storage.getAuthorizedUrl(fileUrl, validDurationInSeconds);
export const downloadB2File = (fileUrl: string) => b2Storage.downloadFile(fileUrl);

