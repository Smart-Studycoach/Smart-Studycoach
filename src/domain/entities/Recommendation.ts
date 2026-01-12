export class Recommendation {
  constructor(
    public readonly moduleId: number,
    public readonly moduleName: string,
    public readonly score: number,
    public readonly location: string,
    public readonly level: string,
    public readonly reason: string
  ) {
    if (score < 0 || score > 1) {
      throw new Error("Score must be between 0 and 1");
    }
  }
}
