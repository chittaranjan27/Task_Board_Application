"use client"

import type React from "react"
import { useState } from "react"
import { useDroppable } from "@dnd-kit/core"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Column, Task } from "../../types"
import { ColumnHeader } from "./ColumnHeader"
import { TaskCard } from "../Task/TaskCard"
import { TaskModal } from "../Task/TaskModal"
import { Button } from "../UI/Button"

interface ColumnComponentProps {
  column: Column
  filteredTasks: Task[]
}

export const ColumnComponent: React.FC<ColumnComponentProps> = ({ column, filteredTasks }) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  return (
    <>
      <div
        ref={setNodeRef}
        className={`
          bg-gray-50 rounded-xl shadow-xs border border-gray-200
          flex flex-col min-h-[500px] w-80
          transition-all duration-200
          ${isOver ? "ring-2 ring-blue-400 bg-blue-50/50" : ""}
        `}
      >
        <ColumnHeader column={column} />

        <div className="flex-1 p-3 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {filteredTasks.map((task) => (
            <DraggableTask key={task.id} task={task} />
          ))}

          {filteredTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center h-32 text-gray-400">
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
              <p className="text-sm">No tasks in this column</p>
              <p className="text-xs mt-1">Drag tasks here or click below</p>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsTaskModalOpen(true)}
            className="w-full justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </Button>
        </div>
      </div>

      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} columnId={column.id} />
    </>
  )
}

interface DraggableTaskProps {
  task: Task
}

const DraggableTask: React.FC<DraggableTaskProps> = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 150ms ease',
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={`${isDragging ? "opacity-60" : "opacity-100"}`}
    >
      <TaskCard task={task} isDragging={isDragging} />
    </div>
  )
}