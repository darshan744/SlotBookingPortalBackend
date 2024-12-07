
export interface IBaseResponse {
    success:boolean,
    message:string
}

export interface IFileUploadSuccess extends IBaseResponse {
    fileName:string,
}

export interface IFileUploadError extends IBaseResponse {
    error:string
}
