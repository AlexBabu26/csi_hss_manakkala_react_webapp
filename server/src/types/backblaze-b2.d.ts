// Type declaration for backblaze-b2 module
declare module 'backblaze-b2' {
  export default class B2 {
    constructor(options: { applicationKeyId: string; applicationKey: string });
    authorize(): Promise<{ data: any }>;
    uploadFile(options: any): Promise<any>;
    downloadFileById(options: any): Promise<any>;
    getDownloadAuthorization(options: any): Promise<any>;
    [key: string]: any;
  }
}



