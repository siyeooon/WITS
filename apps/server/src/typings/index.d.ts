declare module "http" {
  export interface IncomingMessage<T> {
    session?: {
      userId: number;
    };
  }
}
