"use client"

import type React from "react"
import { useState } from "react"
import type { Column } from "../../types"
import { useBoardContext } from "../../context/BoardContext"

interface ColumnHeaderProps {
  column: Column
}

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({ column }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(column.title)
  const { updateColumn, deleteColumn } = useBoardContext()

  const handleSave = () => {
    if (title.trim()) {
      updateColumn(column.id, title.trim())
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setTitle(column.title)
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (window.confirm(
      `Are you sure you want to delete the "${column.title}" column? This will also delete all tasks in this column.`
    )) {
      deleteColumn(column.id)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave()
    } else if (e.key === "Escape") {
      handleCancel()
    }
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200 rounded-t-lg">
      {isEditing ? (
        <div className="flex items-center gap-2 flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleSave}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-xs
                      focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-blue-500
                      hover:border-gray-400 transition-all duration-150"
            autoFocus
          />
          <div className="flex gap-1">
            <button
              onClick={handleSave}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Save"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button
              onClick={handleCancel}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Cancel"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full group">
          <div className="flex items-center gap-2">
            <h3
              className="font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => setIsEditing(true)}
            >
              {column.title}
            </h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {column.tasks.length}
            </span>
          </div>
          <button 
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete column"
            aria-label={`Delete column "${column.title}"`}
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
      )}
    </div>
  )
}