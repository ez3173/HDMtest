# HDMtest

## Explanation of Technical Choices

### TaskController

- **@Post('/tasks')**: This route creates a new task by passing the necessary data to `SaveTaskUseCase`. The `UseCaseFactory` dynamically instantiates the use case.
- **@Patch('/tasks/:id')**: This route updates an existing task by calling the same `SaveTaskUseCase`. A `console.log(dto)` has been added to debug incoming data.

### TaskRepository

This file handles task persistence in the database using Prisma.

- If `data.id` is undefined, a new task is created.
- Otherwise, it updates the task corresponding to that ID.

### SaveTaskUseCase

This class applies business rules to save a task.

- It first checks that `dto.name` is not empty, otherwise, an error is thrown.
- If an ID is provided, the existing task is updated.
- Otherwise, a new task is created.
- Error handling is implemented to prevent crashes.

### TodoPage

This page manages the display and interaction with tasks.

#### State Management

- `tasks` stores the list of tasks.
- `newTaskName` holds the value of the input field for adding tasks.
- `editedNames` is an associative object to store edited task names.

#### Methods

- `.handleFetchTasks()`: Loads tasks from the API.
- `.handleDelete(id)`: Deletes a task and reloads the list.
- `.handleSave()`: Adds a new task if it's not empty.
- `.handleUpdate(id, updatedName, oldName)`: Updates a task only if the name has changed.
- `.handleChange(id, value)`: Updates `editedNames` to manage real-time editing.

## Challenges Faced

During the development of this project, I encountered several challenges:

- **Prisma and NestJS**: Since I was not familiar with these technologies during my studies, I had to take the time to thoroughly understand how they work.
- **Adapting to a Pre-existing Codebase**: Integrating new features into an existing codebase required careful reading and comprehension of annotations and overall architecture.
- **Handling Task Updates**: Initially, updating a task created a new entry in the database instead of modifying the existing one. By analyzing the `TaskRepository` code, I was able to fix this issue by ensuring that an ID was present before executing the update.