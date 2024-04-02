import DataExpiracao from '../../../../../src/core/domain/valueObjects/DataExpiracao';

describe('DataExpiracao', () => {
  it('should create a new DataExpiracao', () => {
    const dataExpiracao = DataExpiracao.setValue();

    expect(dataExpiracao).toBeInstanceOf(DataExpiracao);
    expect(parseInt(dataExpiracao.getValue())).toBeGreaterThan(Date.now());
  });
});
