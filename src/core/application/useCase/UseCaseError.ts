interface IUseCaseErrorError {
  message: string;
  error?: any;
}

export class UseCaseError implements IUseCaseErrorError {
  public readonly message: string;
  public readonly error?: any;
  constructor(message: string, error?: any) {
    this.message = message;
    this.error = error;
  }
}
