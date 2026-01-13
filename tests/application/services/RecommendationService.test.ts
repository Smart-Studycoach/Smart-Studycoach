import { RecommendationService } from '@/application/services/RecommendationService';
import { Recommendation } from '@/domain/entities/Recommendation';
import { IRecommendationRepository } from '@/domain/repositories/IRecommendationRepository';

describe('RecommendationService - RecommendCourses', () => {
  let mockRepo: jest.Mocked<IRecommendationRepository>;
  let service: RecommendationService;

  beforeEach(() => {
    mockRepo = {
      recommendCourses: jest.fn()
    } as any;
    service = new RecommendationService(mockRepo);
  });

  test('delegates to repository with all parameters', async () => {
    const mockRecommendations = [
      new Recommendation(165, 'Math', 0.9, 'Campus', 'Beginner', 'Great match'),
      new Recommendation(166, 'Physics', 0.8, 'Online', 'Intermediate', 'Good fit')
    ];
    mockRepo.recommendCourses.mockResolvedValue(mockRecommendations);

    const result = await service.RecommendCourses('algebra linear equations', 'Beginner', 'Campus', 5);

    expect(mockRepo.recommendCourses).toHaveBeenCalledWith('algebra linear equations', 'Beginner', 'Campus', 5);
    expect(result).toEqual(mockRecommendations);
  });

  test('uses default k=3 when not provided', async () => {
    mockRepo.recommendCourses.mockResolvedValue([]);

    await service.RecommendCourses('test', 'Advanced', 'Online');

    expect(mockRepo.recommendCourses).toHaveBeenCalledWith('test', 'Advanced', 'Online', 3);
  });

  test('handles empty results from repository', async () => {
    mockRepo.recommendCourses.mockResolvedValue([]);

    const result = await service.RecommendCourses('nonexistent', 'Beginner', 'Campus', 3);

    expect(result).toEqual([]);
  });

  test('handles single recommendation', async () => {
    const single = [new Recommendation(175, 'Solo', 0.95, 'Hybrid', 'Expert', 'Perfect')];
    mockRepo.recommendCourses.mockResolvedValue(single);

    const result = await service.RecommendCourses('specific query', 'Expert', 'Hybrid', 1);

    expect(result).toHaveLength(1);
    expect(result[0].moduleId).toBe(175);
  });

  test('handles k=10 for larger result sets', async () => {
    const many = Array.from({ length: 10 }, (_, i) => 
      new Recommendation(165 + i, `Module${165 + i}`, 0.5, 'Campus', 'Mid', 'Reason')
    );
    mockRepo.recommendCourses.mockResolvedValue(many);

    const result = await service.RecommendCourses('broad search', 'Intermediate', 'Any', 10);

    expect(mockRepo.recommendCourses).toHaveBeenCalledWith('broad search', 'Intermediate', 'Any', 10);
    expect(result).toHaveLength(10);
  });

  test('handles empty interest text', async () => {
    mockRepo.recommendCourses.mockResolvedValue([]);

    await service.RecommendCourses('', 'Beginner', 'Campus', 3);

    expect(mockRepo.recommendCourses).toHaveBeenCalledWith('', 'Beginner', 'Campus', 3);
  });

  test('handles special characters in interest text', async () => {
    mockRepo.recommendCourses.mockResolvedValue([]);

    await service.RecommendCourses('C++ & Java!', 'Advanced', 'Online', 5);

    expect(mockRepo.recommendCourses).toHaveBeenCalledWith('C++ & Java!', 'Advanced', 'Online', 5);
  });

  test('handles long interest text', async () => {
    const longText = 'I am interested in ' + 'machine learning '.repeat(50);
    mockRepo.recommendCourses.mockResolvedValue([]);

    await service.RecommendCourses(longText, 'Advanced', 'Online', 3);

    expect(mockRepo.recommendCourses).toHaveBeenCalledWith(longText, 'Advanced', 'Online', 3);
  });

  test('propagates repository errors', async () => {
    mockRepo.recommendCourses.mockRejectedValue(new Error('Database connection failed'));

    await expect(
      service.RecommendCourses('test', 'Beginner', 'Campus', 3)
    ).rejects.toThrow('Database connection failed');
  });

  test('handles different location values', async () => {
    mockRepo.recommendCourses.mockResolvedValue([]);

    await service.RecommendCourses('text', 'Mid', 'Remote', 3);
    expect(mockRepo.recommendCourses).toHaveBeenCalledWith('text', 'Mid', 'Remote', 3);
  });

  test('handles different level values', async () => {
    mockRepo.recommendCourses.mockResolvedValue([]);

    await service.RecommendCourses('text', 'Beginner', 'Campus', 3);
    expect(mockRepo.recommendCourses).toHaveBeenCalledWith('text', 'Beginner', 'Campus', 3);
  });
});
