export abstract class TaskRepository {
  abstract create(data: any): Promise<any>;

  abstract update(
    taskId: string,
    data: any,
  ): Promise<any>;

  abstract delete(
    taskId: string,
  ): Promise<any>;

  abstract pause(
  taskId: string,
): Promise<any>;

abstract activate(
  taskId: string,
): Promise<any>;

abstract findPublicTasks(data: {
  page: number;

  limit: number;

  type?: string;

  featured?: boolean;

  search?: string;
}): Promise<any>;

  abstract findById(
    taskId: string,
  ): Promise<any>;

  abstract findBySlug(
    slug: string,
  ): Promise<any>;

  abstract findAll(): Promise<any[]>;

  abstract findActiveTasks(): Promise<any[]>;
}