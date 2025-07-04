"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Task, Priority } from "../../types"
import { useBoardContext } from "../../context/BoardContext"
import { Modal } from "../UI/Modal"
import { Input } from "../UI/Input"
import { Select } from "../UI/Select"
import { Button } from "../UI/Button"

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  task?: Task
  columnId?: string
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task, columnId }) => {
  const { createTask, updateTask } = useBoardContext()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    createdBy: "",
    priority: "medium" as Priority,
    dueDate: "",
  })

  const isEditing = !!task

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        createdBy: task.createdBy,
        priority: task.priority,
        dueDate: task.dueDate,
      })
    } else {
      setFormData({
        title: "",
        description: "",
        createdBy: "",
        priority: "medium",
        dueDate: "",
      })
    }
  }, [task, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.createdBy.trim() || !formData.dueDate) {
      return
    }

    if (isEditing && task) {
      updateTask(task.id, formData)
    } else if (columnId) {
      createTask(columnId, formData)
    }

    onClose()
  }

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ]

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEditing ? "Edit Task" : "Create New Task"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Title *"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter task title"
          required
          autoFocus
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter task description (optional)"
            rows={4}
            className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg shadow-xs
                      focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-blue-500
                      hover:border-gray-400 transition-all duration-150"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Created By *"
            value={formData.createdBy}
            onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
            placeholder="Your name"
            required
          />

          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
            options={priorityOptions}
          />
        </div>

        <Input
          label="Due Date *"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          required
        />

        <div className="flex justify-end space-x-3 pt-2">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onClose}
            className="border border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isEditing ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
