"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useBoardContext } from "../context/BoardContext"
import type { Priority, Task } from "../types"
import { Button } from "../components/UI/Button"
import { Input } from "../components/UI/Input"
import { ColumnComponent } from "../components/Column/ColumnComponent"
import { BoardFilters } from "../components/Board/BoardFilters"

export const BoardDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { boards, currentBoard, setCurrentBoard, createColumn, moveTask, reorderTasks } = useBoardContext()

  const [newColumnTitle, setNewColumnTitle] = useState("")
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all")
  const [dueDateFilter, setDueDateFilter] = useState<"all" | "overdue" | "today" | "week">("all")
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  useEffect(() => {
    if (id) {
      const board = boards.find((b) => b.id === id)
      if (board) {
        setCurrentBoard(board)
      } else {
        navigate("/boards")
      }
    }
  }, [id, boards, setCurrentBoard, navigate])

  const filteredTasksByColumn = useMemo(() => {
    if (!currentBoard) return {}

    const result: { [columnId: string]: Task[] } = {}

    currentBoard.columns.forEach((column) => {
      let tasks = [...column.tasks].sort((a, b) => a.order - b.order)

      // Apply search filter
      if (searchTerm) {
        tasks = tasks.filter(
          (task) =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      // Apply priority filter
      if (priorityFilter !== "all") {
        tasks = tasks.filter((task) => task.priority === priorityFilter)
      }

      // Apply due date filter
      if (dueDateFilter !== "all") {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        tasks = tasks.filter((task) => {
          if (!task.dueDate) return false
          const dueDate = new Date(task.dueDate)
          dueDate.setHours(0, 0, 0, 0)

          switch (dueDateFilter) {
            case "overdue":
              return dueDate < today
            case "today":
              return dueDate.getTime() === today.getTime()
            case "week":
              const weekFromNow = new Date(today)
              weekFromNow.setDate(today.getDate() + 7)
              return dueDate >= today && dueDate <= weekFromNow
            default:
              return true
          }
        })
      }

      result[column.id] = tasks
    })

    return result
  }, [currentBoard, searchTerm, priorityFilter, dueDateFilter])

  const handleCreateColumn = () => {
    if (newColumnTitle.trim() && currentBoard) {
      createColumn(currentBoard.id, newColumnTitle.trim())
      setNewColumnTitle("")
      setIsAddingColumn(false)
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find the columns
    const activeColumn = currentBoard?.columns.find((col) => col.tasks.some((task) => task.id === activeId))
    const overColumn =
      currentBoard?.columns.find((col) => col.id === overId) ||
      currentBoard?.columns.find((col) => col.tasks.some((task) => task.id === overId))

    if (!activeColumn || !overColumn) return

    // If moving to a different column
    if (activeColumn.id !== overColumn.id) {
      const overTasks = overColumn.tasks
      const overTaskIndex = overTasks.findIndex((task) => task.id === overId)
      const newIndex = overTaskIndex >= 0 ? overTaskIndex : overTasks.length

      moveTask(activeId, overColumn.id, newIndex)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find the column containing the active task
    const activeColumn = currentBoard?.columns.find((col) => col.tasks.some((task) => task.id === activeId))

    if (!activeColumn) return

    const activeIndex = activeColumn.tasks.findIndex((task) => task.id === activeId)
    const overIndex = activeColumn.tasks.findIndex((task) => task.id === overId)

    // If reordering within the same column
    if (activeIndex !== overIndex && overIndex >= 0) {
      const newTaskOrder = [...activeColumn.tasks]
      const [movedTask] = newTaskOrder.splice(activeIndex, 1)
      newTaskOrder.splice(overIndex, 0, movedTask)

      reorderTasks(
        activeColumn.id,
        newTaskOrder.map((task) => task.id),
      )
    }
  }

  if (!currentBoard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-md max-w-md w-full">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Board not found</h2>
          <p className="text-gray-600 mb-6">The board you're looking for doesn't exist or may have been removed.</p>
          <Button 
            onClick={() => navigate("/boards")}
            className="bg-indigo-600 hover:bg-indigo-700 w-full"
          >
            Back to Boards
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/boards")} 
              className="flex items-center bg-white hover:bg-gray-100 shadow-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Boards
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">{currentBoard.name}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden md:block h-8 w-px bg-gray-300"></div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date(currentBoard.updatedAt || currentBoard.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white p-4 rounded-xl shadow-sm">
          <BoardFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            dueDateFilter={dueDateFilter}
            onDueDateFilterChange={setDueDateFilter}
          />
        </div>

        {/* Board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {currentBoard.columns.map((column) => (
              <SortableContext
                key={column.id}
                items={filteredTasksByColumn[column.id]?.map((task) => task.id) || []}
                strategy={verticalListSortingStrategy}
              >
                <ColumnComponent 
                  column={column} 
                  filteredTasks={filteredTasksByColumn[column.id] || []} 
                />
              </SortableContext>
            ))}

            {/* Add Column */}
            <div className="w-72 flex-shrink-0">
              {isAddingColumn ? (
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 h-fit">
                  <Input
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    placeholder="Enter column title"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleCreateColumn()
                      } else if (e.key === "Escape") {
                        setIsAddingColumn(false)
                        setNewColumnTitle("")
                      }
                    }}
                    autoFocus
                    className="mb-3"
                  />
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={handleCreateColumn}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                    >
                      Add Column
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setIsAddingColumn(false)
                        setNewColumnTitle("")
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingColumn(true)}
                  className="w-full h-16 bg-white hover:bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:shadow-sm"
                >
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="font-medium">Add Column</span>
                </button>
              )}
            </div>
          </div>
        </DndContext>
      </div>
    </div>
  )
}