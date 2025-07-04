"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Board, Column, Task, BoardContextType } from "../types"
import { getBoards, saveBoards, generateId } from "../utils/localStorage"

const BoardContext = createContext<BoardContextType | undefined>(undefined)

export const useBoardContext = () => {
  const context = useContext(BoardContext)
  if (!context) {
    throw new Error("useBoardContext must be used within a BoardProvider")
  }
  return context
}

interface BoardProviderProps {
  children: ReactNode
}

export const BoardProvider: React.FC<BoardProviderProps> = ({ children }) => {
  const [boards, setBoards] = useState<Board[]>([])
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null)

  // Load boards from localStorage on mount
  useEffect(() => {
    const savedBoards = getBoards()
    setBoards(savedBoards)
  }, [])

  // Save boards to localStorage whenever boards change
  useEffect(() => {
    saveBoards(boards)
  }, [boards])

  const createBoard = (name: string) => {
    const newBoard: Board = {
      id: generateId(),
      name,
      createdAt: new Date().toISOString(),
      columns: [],
    }
    setBoards((prev) => [...prev, newBoard])
  }

  const deleteBoard = (id: string) => {
    setBoards((prev) => prev.filter((board) => board.id !== id))
    if (currentBoard?.id === id) {
      setCurrentBoard(null)
    }
  }

  const updateBoard = (updatedBoard: Board) => {
    setBoards((prev) => prev.map((board) => (board.id === updatedBoard.id ? updatedBoard : board)))
    if (currentBoard?.id === updatedBoard.id) {
      setCurrentBoard(updatedBoard)
    }
  }

  const createColumn = (boardId: string, title: string) => {
    setBoards((prev) =>
      prev.map((board) => {
        if (board.id === boardId) {
          const newColumn: Column = {
            id: generateId(),
            title,
            boardId,
            order: board.columns.length,
            tasks: [],
          }
          const updatedBoard = {
            ...board,
            columns: [...board.columns, newColumn],
          }
          if (currentBoard?.id === boardId) {
            setCurrentBoard(updatedBoard)
          }
          return updatedBoard
        }
        return board
      }),
    )
  }

  const updateColumn = (columnId: string, title: string) => {
    setBoards((prev) =>
      prev.map((board) => ({
        ...board,
        columns: board.columns.map((column) => (column.id === columnId ? { ...column, title } : column)),
      })),
    )

    if (currentBoard) {
      setCurrentBoard({
        ...currentBoard,
        columns: currentBoard.columns.map((column) => (column.id === columnId ? { ...column, title } : column)),
      })
    }
  }

  const deleteColumn = (columnId: string) => {
    setBoards((prev) =>
      prev.map((board) => ({
        ...board,
        columns: board.columns.filter((column) => column.id !== columnId),
      })),
    )

    if (currentBoard) {
      setCurrentBoard({
        ...currentBoard,
        columns: currentBoard.columns.filter((column) => column.id !== columnId),
      })
    }
  }

  const createTask = (columnId: string, taskData: Omit<Task, "id" | "columnId" | "order" | "createdAt">) => {
    setBoards((prev) =>
      prev.map((board) => ({
        ...board,
        columns: board.columns.map((column) => {
          if (column.id === columnId) {
            const newTask: Task = {
              ...taskData,
              id: generateId(),
              columnId,
              order: column.tasks.length,
              createdAt: new Date().toISOString(),
            }
            return {
              ...column,
              tasks: [...column.tasks, newTask],
            }
          }
          return column
        }),
      })),
    )

    if (currentBoard) {
      setCurrentBoard({
        ...currentBoard,
        columns: currentBoard.columns.map((column) => {
          if (column.id === columnId) {
            const newTask: Task = {
              ...taskData,
              id: generateId(),
              columnId,
              order: column.tasks.length,
              createdAt: new Date().toISOString(),
            }
            return {
              ...column,
              tasks: [...column.tasks, newTask],
            }
          }
          return column
        }),
      })
    }
  }

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setBoards((prev) =>
      prev.map((board) => ({
        ...board,
        columns: board.columns.map((column) => ({
          ...column,
          tasks: column.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)),
        })),
      })),
    )

    if (currentBoard) {
      setCurrentBoard({
        ...currentBoard,
        columns: currentBoard.columns.map((column) => ({
          ...column,
          tasks: column.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)),
        })),
      })
    }
  }

  const deleteTask = (taskId: string) => {
    setBoards((prev) =>
      prev.map((board) => ({
        ...board,
        columns: board.columns.map((column) => ({
          ...column,
          tasks: column.tasks.filter((task) => task.id !== taskId),
        })),
      })),
    )

    if (currentBoard) {
      setCurrentBoard({
        ...currentBoard,
        columns: currentBoard.columns.map((column) => ({
          ...column,
          tasks: column.tasks.filter((task) => task.id !== taskId),
        })),
      })
    }
  }

  const moveTask = (taskId: string, newColumnId: string, newOrder: number) => {
    let taskToMove: Task | null = null

    // Find and remove the task from its current column
    setBoards((prev) =>
      prev.map((board) => {
        const updatedColumns = board.columns.map((column) => {
          const taskIndex = column.tasks.findIndex((task) => task.id === taskId)
          if (taskIndex !== -1) {
            taskToMove = { ...column.tasks[taskIndex], columnId: newColumnId }
            return {
              ...column,
              tasks: column.tasks.filter((task) => task.id !== taskId),
            }
          }
          return column
        })

        // Add the task to the new column
        if (taskToMove) {
          return {
            ...board,
            columns: updatedColumns.map((column) => {
              if (column.id === newColumnId) {
                const newTasks = [...column.tasks]
                newTasks.splice(newOrder, 0, taskToMove!)
                return {
                  ...column,
                  tasks: newTasks.map((task, index) => ({ ...task, order: index })),
                }
              }
              return column
            }),
          }
        }

        return { ...board, columns: updatedColumns }
      }),
    )

    // Update current board if it's the active one
    if (currentBoard && taskToMove) {
      const updatedColumns = currentBoard.columns.map((column) => {
        const taskIndex = column.tasks.findIndex((task) => task.id === taskId)
        if (taskIndex !== -1) {
          return {
            ...column,
            tasks: column.tasks.filter((task) => task.id !== taskId),
          }
        }
        return column
      })

      setCurrentBoard({
        ...currentBoard,
        columns: updatedColumns.map((column) => {
          if (column.id === newColumnId) {
            const newTasks = [...column.tasks]
            newTasks.splice(newOrder, 0, taskToMove!)
            return {
              ...column,
              tasks: newTasks.map((task, index) => ({ ...task, order: index })),
            }
          }
          return column
        }),
      })
    }
  }

  const reorderTasks = (columnId: string, taskIds: string[]) => {
    setBoards((prev) =>
      prev.map((board) => ({
        ...board,
        columns: board.columns.map((column) => {
          if (column.id === columnId) {
            const reorderedTasks = taskIds.map((taskId, index) => {
              const task = column.tasks.find((t) => t.id === taskId)!
              return { ...task, order: index }
            })
            return { ...column, tasks: reorderedTasks }
          }
          return column
        }),
      })),
    )

    if (currentBoard) {
      setCurrentBoard({
        ...currentBoard,
        columns: currentBoard.columns.map((column) => {
          if (column.id === columnId) {
            const reorderedTasks = taskIds.map((taskId, index) => {
              const task = column.tasks.find((t) => t.id === taskId)!
              return { ...task, order: index }
            })
            return { ...column, tasks: reorderedTasks }
          }
          return column
        }),
      })
    }
  }

  const value: BoardContextType = {
    boards,
    currentBoard,
    createBoard,
    deleteBoard,
    setCurrentBoard,
    updateBoard,
    createColumn,
    updateColumn,
    deleteColumn,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTasks,
  }

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
}
