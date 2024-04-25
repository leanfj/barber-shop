export default interface IRepository<T, R> {
  exists: (t: T) => Promise<boolean>;
  delete: (t: T) => Promise<any>;
  getById: (id: string) => Promise<R>;
  save: (t: T) => Promise<R>;
}
