import { Recommendation } from '@/domain/entities/Recommendation';

describe('Recommendation Entity', () => {
  describe('Valid recommendations', () => {
    test('creates recommendation with valid score', () => {
      const rec = new Recommendation(165, 'Module', 0.5, 'Location', 'Level', 'Reason');
      
      expect(rec.moduleId).toBe(165);
      expect(rec.moduleName).toBe('Module');
      expect(rec.score).toBe(0.5);
      expect(rec.location).toBe('Location');
      expect(rec.level).toBe('Level');
      expect(rec.reason).toBe('Reason');
    });

    test('accepts score of 0', () => {
      const rec = new Recommendation(165, 'Module', 0, 'Location', 'Level', 'Reason');
      expect(rec.score).toBe(0);
    });

    test('accepts score of 1', () => {
      const rec = new Recommendation(165, 'Module', 1, 'Location', 'Level', 'Reason');
      expect(rec.score).toBe(1);
    });

    test('accepts decimal scores', () => {
      const rec = new Recommendation(165, 'Module', 0.12345, 'Location', 'Level', 'Reason');
      expect(rec.score).toBe(0.12345);
    });

    test('accepts very small positive score', () => {
      const rec = new Recommendation(165, 'Module', 0.00001, 'Location', 'Level', 'Reason');
      expect(rec.score).toBe(0.00001);
    });

    test('accepts score very close to 1', () => {
      const rec = new Recommendation(165, 'Module', 0.99999, 'Location', 'Level', 'Reason');
      expect(rec.score).toBe(0.99999);
    });
  });

  describe('Invalid scores', () => {
    test('throws error when score is negative', () => {
      expect(() => {
        new Recommendation(165, 'Module', -0.1, 'Location', 'Level', 'Reason');
      }).toThrow('Score must be between 0 and 1');
    });

    test('throws error when score is greater than 1', () => {
      expect(() => {
        new Recommendation(165, 'Module', 1.1, 'Location', 'Level', 'Reason');
      }).toThrow('Score must be between 0 and 1');
    });

    test('throws error when score is 2', () => {
      expect(() => {
        new Recommendation(165, 'Module', 2, 'Location', 'Level', 'Reason');
      }).toThrow('Score must be between 0 and 1');
    });

    test('throws error when score is very negative', () => {
      expect(() => {
        new Recommendation(165, 'Module', -100, 'Location', 'Level', 'Reason');
      }).toThrow('Score must be between 0 and 1');
    });

    test('throws error when score is slightly above 1', () => {
      expect(() => {
        new Recommendation(165, 'Module', 1.00001, 'Location', 'Level', 'Reason');
      }).toThrow('Score must be between 0 and 1');
    });
  });

  describe('Field values', () => {
    test('handles large module IDs', () => {
      const rec = new Recommendation(999999, 'Module', 0.5, 'Location', 'Level', 'Reason');
      expect(rec.moduleId).toBe(999999);
    });

    test('handles empty strings for text fields', () => {
      const rec = new Recommendation(165, '', 0.5, '', '', '');
      expect(rec.moduleName).toBe('');
      expect(rec.location).toBe('');
      expect(rec.level).toBe('');
      expect(rec.reason).toBe('');
    });

    test('handles long text strings', () => {
      const longName = 'A'.repeat(1000);
      const longLocation = 'B'.repeat(500);
      const longLevel = 'C'.repeat(200);
      const longReason = 'D'.repeat(2000);
      
      const rec = new Recommendation(165, longName, 0.5, longLocation, longLevel, longReason);
      
      expect(rec.moduleName).toBe(longName);
      expect(rec.location).toBe(longLocation);
      expect(rec.level).toBe(longLevel);
      expect(rec.reason).toBe(longReason);
    });

    test('handles special characters in text fields', () => {
      const rec = new Recommendation(
        165,
        'Module & <Special>',
        0.5,
        'Location/Campus',
        'Level-A',
        'Reason: "quoted"'
      );
      
      expect(rec.moduleName).toBe('Module & <Special>');
      expect(rec.location).toBe('Location/Campus');
      expect(rec.level).toBe('Level-A');
      expect(rec.reason).toBe('Reason: "quoted"');
    });

    test('handles unicode characters', () => {
      const rec = new Recommendation(
        165,
        'Módulo de Matemáticas 数学',
        0.5,
        'Localización',
        'Niveau',
        'Raison: 理由'
      );
      
      expect(rec.moduleName).toContain('Matemáticas');
      expect(rec.reason).toContain('理由');
    });
  });
});
