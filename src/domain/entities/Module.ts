// Domain Entity - Pure business object with no external dependencies

export interface Module {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
