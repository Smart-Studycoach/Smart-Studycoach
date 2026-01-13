import { ModuleService } from "@/application/services/ModuleService";
import { Module, ModuleMinimal, ModuleFilters } from "@/domain";
import { IModuleRepository } from "@/domain/repositories/IModuleRepository";

const mockModule: Module = {
  _id: "507f1f77bcf86cd799439011",
  module_id: 165,
  name: "Introduction to Programming",
  shortdescription: ["Learn basics", "Hands-on coding"],
  description: "Complete introduction to programming fundamentals",
  studycredit: 5,
  location: ["Campus A", "Online"],
  level: "Beginner",
  learningoutcomes: "Understand variables, loops, and functions",
  estimated_difficulty: 3,
  available_spots: 30,
  start_date: "2026-09-01",
};

describe("ModuleService - getAllModules", () => {
  let mockRepo: jest.Mocked<IModuleRepository>;
  let service: ModuleService;

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findMinimalsByIds: jest.fn(),
    } as any;
    service = new ModuleService(mockRepo);
  });

  test("returns all modules without filters", async () => {
    const modules = [mockModule];
    mockRepo.findAll.mockResolvedValue(modules);

    const result = await service.getAllModules();

    expect(mockRepo.findAll).toHaveBeenCalledWith(undefined);
    expect(result).toEqual(modules);
  });

  test("returns empty array when no modules exist", async () => {
    mockRepo.findAll.mockResolvedValue([]);

    const result = await service.getAllModules();

    expect(result).toEqual([]);
  });

  test("filters by name", async () => {
    const filters: ModuleFilters = { name: "Programming" };
    mockRepo.findAll.mockResolvedValue([mockModule]);

    const result = await service.getAllModules(filters);

    expect(mockRepo.findAll).toHaveBeenCalledWith(filters);
    expect(result).toHaveLength(1);
  });

  test("filters by level", async () => {
    const filters: ModuleFilters = { level: "Beginner" };
    mockRepo.findAll.mockResolvedValue([mockModule]);

    await service.getAllModules(filters);

    expect(mockRepo.findAll).toHaveBeenCalledWith(filters);
  });

  test("filters by studycredit", async () => {
    const filters: ModuleFilters = { studycredit: 5 };
    mockRepo.findAll.mockResolvedValue([mockModule]);

    await service.getAllModules(filters);

    expect(mockRepo.findAll).toHaveBeenCalledWith(filters);
  });

  test("filters by location", async () => {
    const filters: ModuleFilters = { location: "Campus A" };
    mockRepo.findAll.mockResolvedValue([mockModule]);

    await service.getAllModules(filters);

    expect(mockRepo.findAll).toHaveBeenCalledWith(filters);
  });

  test("filters by estimated_difficulty", async () => {
    const filters: ModuleFilters = { estimated_difficulty: 3 };
    mockRepo.findAll.mockResolvedValue([mockModule]);

    await service.getAllModules(filters);

    expect(mockRepo.findAll).toHaveBeenCalledWith(filters);
  });

  test("combines multiple filters", async () => {
    const filters: ModuleFilters = {
      name: "Programming",
      level: "Beginner",
      studycredit: 5,
    };
    mockRepo.findAll.mockResolvedValue([mockModule]);

    await service.getAllModules(filters);

    expect(mockRepo.findAll).toHaveBeenCalledWith(filters);
  });

  test("returns multiple modules", async () => {
    const modules = [
      mockModule,
      {
        ...mockModule,
        _id: "507f1f77bcf86cd799439012",
        module_id: 166,
        name: "Advanced Programming",
      },
    ];
    mockRepo.findAll.mockResolvedValue(modules);

    const result = await service.getAllModules();

    expect(result).toHaveLength(2);
  });
});

describe("ModuleService - getModuleById", () => {
  let mockRepo: jest.Mocked<IModuleRepository>;
  let service: ModuleService;

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findMinimalsByIds: jest.fn(),
    } as any;
    service = new ModuleService(mockRepo);
  });

  test("returns module when found", async () => {
    mockRepo.findById.mockResolvedValue(mockModule);

    const result = await service.getModuleById("1");

    expect(mockRepo.findById).toHaveBeenCalledWith("1");
    expect(result).toEqual(mockModule);
  });

  test("returns null when module not found", async () => {
    mockRepo.findById.mockResolvedValue(null);

    const result = await service.getModuleById("999");

    expect(result).toBeNull();
  });

  test("handles string ID", async () => {
    mockRepo.findById.mockResolvedValue(mockModule);

    await service.getModuleById("123");

    expect(mockRepo.findById).toHaveBeenCalledWith("123");
  });

  test("handles numeric string ID", async () => {
    mockRepo.findById.mockResolvedValue(mockModule);

    await service.getModuleById("001");

    expect(mockRepo.findById).toHaveBeenCalledWith("001");
  });

  test("handles MongoDB ObjectId format", async () => {
    mockRepo.findById.mockResolvedValue(mockModule);

    await service.getModuleById("507f1f77bcf86cd799439011");

    expect(mockRepo.findById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
  });
});

describe("ModuleService - getModulesByIds", () => {
  let mockRepo: jest.Mocked<IModuleRepository>;
  let service: ModuleService;

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findMinimalsByIds: jest.fn(),
    } as any;
    service = new ModuleService(mockRepo);
  });

  test("returns minimal modules for valid IDs", async () => {
    const minimals: ModuleMinimal[] = [
      { module_id: 165, name: "Module 1" },
      { module_id: 166, name: "Module 2" },
    ];
    mockRepo.findMinimalsByIds.mockResolvedValue(minimals);

    const result = await service.getModulesByIds([165, 166]);

    expect(mockRepo.findMinimalsByIds).toHaveBeenCalledWith([165, 166]);
    expect(result).toEqual(minimals);
  });

  test("returns null when no modules found", async () => {
    mockRepo.findMinimalsByIds.mockResolvedValue(null);

    const result = await service.getModulesByIds([999]);

    expect(result).toBeNull();
  });

  test("handles empty array", async () => {
    mockRepo.findMinimalsByIds.mockResolvedValue([]);

    const result = await service.getModulesByIds([]);

    expect(mockRepo.findMinimalsByIds).toHaveBeenCalledWith([]);
    expect(result).toEqual([]);
  });

  test("handles single ID", async () => {
    const minimals: ModuleMinimal[] = [
      { module_id: 170, name: "Single Module" },
    ];
    mockRepo.findMinimalsByIds.mockResolvedValue(minimals);

    const result = await service.getModulesByIds([170]);

    expect(result).toHaveLength(1);
    expect(result![0].module_id).toBe(170);
  });

  test("handles large array of IDs", async () => {
    const ids = Array.from({ length: 100 }, (_, i) => 165 + i);
    const minimals = ids.map((id) => ({ module_id: id, name: `Module ${id}` }));
    mockRepo.findMinimalsByIds.mockResolvedValue(minimals);

    const result = await service.getModulesByIds(ids);

    expect(result).toHaveLength(100);
  });

  test("preserves order of results", async () => {
    const minimals: ModuleMinimal[] = [
      { module_id: 167, name: "Third" },
      { module_id: 165, name: "First" },
      { module_id: 166, name: "Second" },
    ];
    mockRepo.findMinimalsByIds.mockResolvedValue(minimals);

    const result = await service.getModulesByIds([167, 165, 166]);

    expect(result![0].module_id).toBe(167);
    expect(result![1].module_id).toBe(165);
    expect(result![2].module_id).toBe(166);
  });

  test("handles duplicate IDs", async () => {
    const minimals: ModuleMinimal[] = [{ module_id: 165, name: "Module 1" }];
    mockRepo.findMinimalsByIds.mockResolvedValue(minimals);

    await service.getModulesByIds([165, 165, 165]);

    expect(mockRepo.findMinimalsByIds).toHaveBeenCalledWith([165, 165, 165]);
  });
});
