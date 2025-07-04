"use client"

import type React from "react"
import { useState } from "react"
import type { Task, Priority } from "../../types"
import { formatDate, isOverdue } from "../../utils/localStorage"
import { useBoardContext } from "../../context/BoardContext"
import { TaskModal } from "./TaskModal"

interface TaskCardProps {
  task: Task
  isDragging?: boolean
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, isDragging = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { deleteTask } = useBoardContext()

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border-red-100"
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-100"
      case "low":
        return "bg-emerald-50 text-emerald-700 border-emerald-100"
      default:
        return "bg-gray-50 text-gray-700 border-gray-100"
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      deleteTask(task.id)
    }
  }

  const dueDateOverdue = isOverdue(task.dueDate)

  return (
    <>
      <div
        className={`
          bg-white rounded-xl shadow-xs border border-gray-100 p-4 cursor-pointer
          transition-all duration-200 hover:shadow-sm hover:border-gray-200
          active:scale-[0.98] active:shadow-none
          ${isDragging ? "opacity-70 shadow-md ring-2 ring-blue-200" : ""}
        `}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <h4 className="font-medium text-gray-900 text-sm line-clamp-2 flex-1">
            {task.title}
          </h4>
          <button 
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 -m-1"
            aria-label={`Delete task "${task.title}"`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        {task.description && (
          <p className="text-gray-600 text-xs mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between gap-2">
          <span
            className={`
              inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border
              ${getPriorityColor(task.priority)}
            `}
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>

          <div className="text-xs">
            <div className={`
              ${dueDateOverdue ? "text-red-600 font-medium" : "text-gray-500"}
              whitespace-nowrap
            `}>
              {formatDate(task.dueDate)}
              {dueDateOverdue && (
                <span className="ml-1 inline-flex items-center">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 text-xs text-gray-400 flex items-center">
          <span className="truncate">By {task.createdBy}</span>
        </div>
      </div>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} task={task} />
    </>
  )
}