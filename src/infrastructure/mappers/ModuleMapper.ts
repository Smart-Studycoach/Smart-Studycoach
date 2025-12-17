import { Module } from "@/domain";

import { IModuleDocument } from "../database/models/ModuleModel";

export class ModuleMapper {
  static mapToDomain(doc: IModuleDocument): Module {
    return {
      _id: doc._id.toString(),
      id: doc.id,
      name: doc.name,
      shortdescription: doc.shortdescription,
      description: doc.description,
      studycredit: doc.studycredit,
      location: doc.location,
      level: doc.level,
      learningoutcomes: doc.learningoutcomes,
      estimated_difficulty: doc.estimated_difficulty,
      available_spots: doc.available_spots,
      start_date: doc.start_date,
    };
  }
}
