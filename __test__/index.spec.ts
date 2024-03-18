import { data } from "../src";

describe('Test', () => {
  it('should return true', () => {
    const dataSUT = data;
    expect(dataSUT).toBe("Hello, world!");
  });
});