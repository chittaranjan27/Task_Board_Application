"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useBoardContext } from "../../context/BoardContext"
import { Modal } from "../UI/Modal"
import { Input } from "../UI/Input"
import { Button } from "../UI/Button"

interface CreateBoardModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CreateBoardModal: React.FC<CreateBoardModalProps> = ({ isOpen, onClose }) => {
  const [boardName, setBoardName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { createBoard } = useBoardContext()

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setBoardName("")
      setIsSubmitting(false)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!boardName.trim()) return
    
    setIsSubmitting(true)
    try {
      await createBoard(boardName.trim())
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Create New Board"
      description="Start organizing your work by creating a new board"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Input
            label="Board name"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            placeholder="e.g. 'Marketing Campaign' or 'Product Roadmap'"
            required
            autoFocus
            maxLength={50}
            showCharacterCount 
            />
          <p className="text-xs text-gray-500">
            Give your board a descriptive name (max 50 characters)
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button 
            type="button" 
            variant="ghost"
            onClick={onClose}
            className="hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={!boardName.trim() || isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? 'Creating...' : 'Create Board'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}