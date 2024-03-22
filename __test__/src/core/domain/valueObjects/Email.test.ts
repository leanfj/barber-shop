import Email from '@core:domain/valueObjects/Email';

describe('Email', () => {
  it('should create a new Email', () => {
    const validEmail = 'test@example.com';
    const email = new Email(validEmail);

    expect(email).toBeInstanceOf(Email);
    expect(email.getValue()).toBe(validEmail);
  });

  it('should throw an error for invalid email', () => {
    const invalidEmail = 'invalidemail';

    expect(() => {
      const email = new Email(invalidEmail);
      return email;
    }).toThrow('Email inválido');
  });
});
