export type Priority = "high" | "medium" | "low"

export interface Task {
  id: string
  title: string
  description: string
  createdBy: string
  priority: Priority
  dueDate: string
  columnId: string
  order: number
  createdAt: string
}

export interface Column {
  id: string
  title: string
  boardId: string
  order: number
  tasks: Task[]
}

export interface Board {
  id: string
  name: string
  createdAt: string
  columns: Column[]
}

export interface BoardContextType {
  boards: Board[]
  currentBoard: Board | null
  createBoard: (name: string) => void
  deleteBoard: (id: string) => void
  setCurrentBoard: (board: Board | null) => void
  updateBoard: (board: Board) => void
  createColumn: (boardId: string, title: string) => void
  updateColumn: (columnId: string, title: string) => void
  deleteColumn: (columnId: string) => void
  createTask: (columnId: string, task: Omit<Task, "id" | "columnId" | "order" | "createdAt">) => void
  updateTask: (taskId: string, updates: Partial<Task>) => void
  deleteTask: (taskId: string) => void
  moveTask: (taskId: string, newColumnId: string, newOrder: number) => void
  reorderTasks: (columnId: string, taskIds: string[]) => void
}
