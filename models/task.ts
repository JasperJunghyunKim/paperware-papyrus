import { Enum, TaskConverting, TaskGuillotine, TaskQuantity } from '.';

export default interface Task {
  id: number;
  taskNo: string;
  type: Enum.TaskType;
  status: Enum.PlanStatus;
  parentTaskId: number | null;
  taskConverting: TaskConverting | null;
  taskGuillotine: TaskGuillotine | null;
  taskQuantity: TaskQuantity | null;
}
