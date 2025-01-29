import { Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { UseCase } from '../../index';
import SaveTaskDto from './SaveTaskDto';
import TaskRepository from '../../Repositories/TaskRepository';

@Injectable()
export default class SaveTaskUseCase
  implements UseCase<Promise<Task>, [dto: SaveTaskDto]>
{
  constructor(private readonly taskRepository: TaskRepository) {}
  async handle(dto: SaveTaskDto): Promise<Task> {
    if (!dto.name || dto.name.trim() === '') {
      throw new Error('Task name is required');
    }

    try {
      if (dto.id) {
        return this.taskRepository.save({
          id: dto.id,
          name: dto.name,
        });
      } else {
        return this.taskRepository.save({
          name: dto.name,
        }) as Promise<Task>;
      }
    } catch (error) {
      throw new Error(`Failed to save task: ${error.message}`);
    }

    return null;
  }
}
