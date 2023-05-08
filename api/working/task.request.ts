export interface TaskCreate {
  planId: number;
  parentTaskId: number | null;
}

export interface TaskCreateConvertingRequest extends TaskCreate {
  sizeX: number;
  sizeY: number;
  memo: string;
}

export interface TaskUpdateConvertingRequest {
  sizeX: number;
  sizeY: number;
  memo: string;
}

export interface TaskCreateGuillotineRequest extends TaskCreate {
  sizeX: number;
  sizeY: number;
  memo: string;
}

export interface TaskUpdateGuillotineRequest {
  sizeX: number;
  sizeY: number;
  memo: string;
}

export interface TaskCreateQuantityRequest extends TaskCreate {
  quantity: number;
}

export interface TaskUpdateQuantityRequest {
  quantity: number;
}

export interface TaskInsertInputStockRequest {
  stockId: number;
  quantity: number;
}
