"use client"

import type React from "react"
import type { Priority } from "../../types"
import { Input } from "../UI/Input"
import { Select } from "../UI/Select"

interface BoardFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  priorityFilter: Priority | "all"
  onPriorityFilterChange: (value: Priority | "all") => void
  dueDateFilter: "all" | "overdue" | "today" | "week"
  onDueDateFilterChange: (value: "all" | "overdue" | "today" | "week") => void
}

export const BoardFilters: React.FC<BoardFiltersProps> = ({
  searchTerm,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  dueDateFilter,
  onDueDateFilterChange,
}) => {
  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "high", label: "High Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "low", label: "Low Priority" },
  ]

  const dueDateOptions = [
    { value: "all", label: "All Due Dates" },
    { value: "overdue", label: "Overdue" },
    { value: "today", label: "Due Today" },
    { value: "week", label: "Due This Week" },
  ]

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input placeholder="Search tasks..." value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} />

        <Select
          value={priorityFilter}
          onChange={(e) => onPriorityFilterChange(e.target.value as Priority | "all")}
          options={priorityOptions}
        />

        <Select
          value={dueDateFilter}
          onChange={(e) => onDueDateFilterChange(e.target.value as "all" | "overdue" | "today" | "week")}
          options={dueDateOptions}
        />
      </div>
    </div>
  )
}
