import { RecommendationMapper } from '@/infrastructure/mappers/RecommendationMapper';
import { Recommendation } from '@/domain/entities/Recommendation';
import { RecommendationDto } from '@/application/dto/RecommendationDto';

describe('RecommendationMapper - toDomain', () => {
  test('maps valid dto to Recommendation entity', () => {
    const dto: RecommendationDto = {
      module_id: 165,
      module_name: 'Mathematics',
      score: 0.8,
      location: 'Campus A',
      level: 'Beginner',
      waarom_match: 'Matches your interests in algebra'
    };

    const domain = RecommendationMapper.toDomain(dto);
    expect(domain).toBeInstanceOf(Recommendation);
    expect(domain.moduleId).toBe(165);
    expect(domain.moduleName).toBe('Mathematics');
    expect(domain.score).toBe(0.8);
    expect(domain.location).toBe('Campus A');
    expect(domain.level).toBe('Beginner');
    expect(domain.reason).toBe('Matches your interests in algebra');
  });

  test('handles minimum score (0)', () => {
    const dto: RecommendationDto = {
      module_id: 166,
      module_name: 'Physics',
      score: 0,
      location: 'Online',
      level: 'Advanced',
      waarom_match: 'Low match'
    };

    const domain = RecommendationMapper.toDomain(dto);
    expect(domain.score).toBe(0);
  });

  test('handles maximum score (1)', () => {
    const dto: RecommendationDto = {
      module_id: 167,
      module_name: 'Chemistry',
      score: 1,
      location: 'Lab',
      level: 'Intermediate',
      waarom_match: 'Perfect match'
    };

    const domain = RecommendationMapper.toDomain(dto);
    expect(domain.score).toBe(1);
  });

  test('throws error for score below 0', () => {
    const dto: RecommendationDto = {
      module_id: 168,
      module_name: 'Biology',
      score: -0.1,
      location: 'Campus B',
      level: 'Beginner',
      waarom_match: 'Invalid score'
    };

    expect(() => RecommendationMapper.toDomain(dto)).toThrow('Score must be between 0 and 1');
  });

  test('throws error for score above 1', () => {
    const dto: RecommendationDto = {
      module_id: 169,
      module_name: 'History',
      score: 1.5,
      location: 'Campus C',
      level: 'Advanced',
      waarom_match: 'Invalid score'
    };

    expect(() => RecommendationMapper.toDomain(dto)).toThrow('Score must be between 0 and 1');
  });

  test('handles empty reason string', () => {
    const dto: RecommendationDto = {
      module_id: 170,
      module_name: 'Art',
      score: 0.5,
      location: 'Studio',
      level: 'Beginner',
      waarom_match: ''
    };

    const domain = RecommendationMapper.toDomain(dto);
    expect(domain.reason).toBe('');
  });

  test('handles long reason text', () => {
    const longReason = 'A'.repeat(1000);
    const dto: RecommendationDto = {
      module_id: 171,
      module_name: 'Music',
      score: 0.75,
      location: 'Conservatory',
      level: 'Intermediate',
      waarom_match: longReason
    };

    const domain = RecommendationMapper.toDomain(dto);
    expect(domain.reason).toBe(longReason);
  });
});

describe('RecommendationMapper - toApplication', () => {
  test('maps Recommendation entity to dto', () => {
    const rec = new Recommendation(
      175,
      'Computer Science',
      0.9,
      'Online',
      'Advanced',
      'Strong technical background'
    );

    const dto = RecommendationMapper.toApplication(rec);
    expect(dto.module_id).toBe(175);
    expect(dto.module_name).toBe('Computer Science');
    expect(dto.score).toBe(0.9);
    expect(dto.location).toBe('Online');
    expect(dto.level).toBe('Advanced');
    expect(dto.waarom_match).toBe('Strong technical background');
  });

  test('preserves all field values accurately', () => {
    const rec = new Recommendation(200, 'Test Module', 0.12345, 'Test Location', 'Test Level', 'Test Reason');
    const dto = RecommendationMapper.toApplication(rec);

    expect(dto.module_id).toBe(200);
    expect(dto.module_name).toBe('Test Module');
    expect(dto.score).toBe(0.12345);
    expect(dto.location).toBe('Test Location');
    expect(dto.level).toBe('Test Level');
    expect(dto.waarom_match).toBe('Test Reason');
  });

  test('handles minimum score', () => {
    const rec = new Recommendation(176, 'Module', 0, 'Loc', 'Lvl', 'Reason');
    const dto = RecommendationMapper.toApplication(rec);
    expect(dto.score).toBe(0);
  });

  test('handles maximum score', () => {
    const rec = new Recommendation(177, 'Module', 1, 'Loc', 'Lvl', 'Reason');
    const dto = RecommendationMapper.toApplication(rec);
    expect(dto.score).toBe(1);
  });
});

describe('RecommendationMapper - list mappings', () => {
  test('toDomainList maps empty array', () => {
    const dtos: RecommendationDto[] = [];
    const domains = RecommendationMapper.toDomainList(dtos);
    expect(domains).toEqual([]);
  });

  test('toDomainList maps single item', () => {
    const dtos: RecommendationDto[] = [
      {
        module_id: 180,
        module_name: 'Single',
        score: 0.5,
        location: 'Place',
        level: 'Mid',
        waarom_match: 'Match'
      }
    ];
    const domains = RecommendationMapper.toDomainList(dtos);
    expect(domains).toHaveLength(1);
    expect(domains[0].moduleId).toBe(180);
  });

  test('toDomainList maps multiple items', () => {
    const dtos: RecommendationDto[] = [
      { module_id: 165, module_name: 'A', score: 0.9, location: 'X', level: 'High', waarom_match: 'R1' },
      { module_id: 166, module_name: 'B', score: 0.7, location: 'Y', level: 'Mid', waarom_match: 'R2' },
      { module_id: 167, module_name: 'C', score: 0.5, location: 'Z', level: 'Low', waarom_match: 'R3' }
    ];
    const domains = RecommendationMapper.toDomainList(dtos);
    expect(domains).toHaveLength(3);
    expect(domains[0].moduleId).toBe(165);
    expect(domains[1].moduleId).toBe(166);
    expect(domains[2].moduleId).toBe(167);
  });

  test('toApplicationList maps empty array', () => {
    const recs: Recommendation[] = [];
    const dtos = RecommendationMapper.toApplicationList(recs);
    expect(dtos).toEqual([]);
  });

  test('toApplicationList maps single item', () => {
    const recs = [new Recommendation(185, 'Single', 0.6, 'Loc', 'Lvl', 'Why')];
    const dtos = RecommendationMapper.toApplicationList(recs);
    expect(dtos).toHaveLength(1);
    expect(dtos[0].module_id).toBe(185);
  });

  test('toApplicationList maps multiple items', () => {
    const recs = [
      new Recommendation(165, 'A', 0.9, 'X', 'High', 'R1'),
      new Recommendation(166, 'B', 0.7, 'Y', 'Mid', 'R2'),
      new Recommendation(167, 'C', 0.5, 'Z', 'Low', 'R3')
    ];
    const dtos = RecommendationMapper.toApplicationList(recs);
    expect(dtos).toHaveLength(3);
    expect(dtos[0].module_id).toBe(165);
    expect(dtos[1].module_id).toBe(166);
    expect(dtos[2].module_id).toBe(167);
  });

  test('round-trip conversion preserves data', () => {
    const original: RecommendationDto[] = [
      { module_id: 200, module_name: 'Test', score: 0.85, location: 'Campus', level: 'Expert', waarom_match: 'Perfect' }
    ];
    const domains = RecommendationMapper.toDomainList(original);
    const back = RecommendationMapper.toApplicationList(domains);
    expect(back).toEqual(original);
  });
});
