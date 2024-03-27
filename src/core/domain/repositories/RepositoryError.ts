interface IRepositoryError {
  message: string;
  error?: any;
}

export class RepositoryError implements IRepositoryError {
  public readonly message: string;
  public readonly error?: any;
  constructor(message: string, error?: any) {
    this.message = message;
    this.error = error;
  }
}
