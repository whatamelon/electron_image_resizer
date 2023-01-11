export {}

declare global {
  interface Window {
    api:{
      saveTextFile (text:string): Promise<string>;
      loadTextFile (): Promise<string>;
      getDirectoryPath (): Promise<string>;
      openDirectory (paths:string): Promise<boolean>;
      getImages (): Promise<Array<string>>;
      resizeImage (originPath:string, savePath:string, imgName:string, percentage:number, minimum:number): Promise<number>;
    }
  }
}
