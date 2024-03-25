import CPF from '../../../../../src/core/domain/valueObjects/CPF';

describe('CPF Value Object', () => {
  test('should create a valid CPF', () => {
    const cpf = CPF.setValue('155.766.660-11');
    expect(cpf.getValue()).toBe('155.766.660-11');
  });
  test('should create an error on invalid CPF', () => {
    expect(() => {
      const cpf = CPF.setValue('155.766.660-12');
      return cpf;
    }).toThrow('CPF inválido');
  });
});
