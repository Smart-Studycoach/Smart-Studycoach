// Domain Entity - Pure business object with no external dependencies

export interface Module {
  _id: string;
  module_id: number;
  name: string;
  shortdescription: string[];
  description: string;
  studycredit: number;
  location: string[];
  level: string;
  learningoutcomes: string;
  estimated_difficulty: number;
  available_spots: number;
  start_date: string;
}

export type mongoDB_id = string;

export interface ModuleMinimal {
  _id: mongoDB_id;
  module_id: number;
  name: string;
}
