import type { Board } from "../types"

const BOARDS_KEY = "taskboard_boards"

/**
 * Get all boards from localStorage
 */
export const getBoards = (): Board[] => {
  try {
    const boards = localStorage.getItem(BOARDS_KEY)
    return boards ? JSON.parse(boards) : []
  } catch (error) {
    console.error("Error getting boards from localStorage:", error)
    return []
  }
}

/**
 * Save boards to localStorage
 */
export const saveBoards = (boards: Board[]): void => {
  try {
    localStorage.setItem(BOARDS_KEY, JSON.stringify(boards))
  } catch (error) {
    console.error("Error saving boards to localStorage:", error)
  }
}

/**
 * Get a specific board by ID
 */
export const getBoardById = (id: string): Board | null => {
  const boards = getBoards()
  return boards.find((board) => board.id === id) || null
}

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

/**
 * Check if a date is overdue
 */
export const isOverdue = (dueDate: string): boolean => {
  const today = new Date()
  const due = new Date(dueDate)
  today.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)
  return due < today
}
