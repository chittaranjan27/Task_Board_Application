"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useBoardContext } from "../context/BoardContext"
import { formatDate } from "../utils/localStorage"
import { Button } from "../components/UI/Button"
import { CreateBoardModal } from "../components/Board/CreateBoardModal"

export const BoardsPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { boards, deleteBoard, setCurrentBoard } = useBoardContext()
  const navigate = useNavigate()

  const handleBoardClick = (boardId: string) => {
    const board = boards.find((b) => b.id === boardId)
    if (board) {
      setCurrentBoard(board)
      navigate(`/boards/${boardId}`)
    }
  }

  const handleDeleteBoard = (e: React.MouseEvent, boardId: string) => {
    e.stopPropagation()
    const board = boards.find((b) => b.id === boardId)
    if (board && window.confirm(`Are you sure you want to delete "${board.name}"?`)) {
      deleteBoard(boardId)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div className="mb-6 md:mb-0">
            <h1 className="text-4xl font-bold text-gray-900">Your Task Boards</h1>
            <p className="text-gray-600 mt-3 text-lg">Organize your projects and tasks efficiently</p>
          </div>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Board
          </Button>
        </div>

        {boards.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm max-w-2xl mx-auto">
            <div className="mx-auto w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <svg 
                className="w-16 h-16 text-indigo-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No boards yet</h3>
            <p className="text-gray-500 mb-8 text-lg max-w-md mx-auto">
              Create your first board to start organizing tasks and collaborating with your team
            </p>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 text-lg"
            >
              Create Your First Board
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boards.map((board) => {
                const totalTasks = board.columns.reduce((sum, column) => sum + column.tasks.length, 0)
                const colors = [
                  'bg-blue-100 border-blue-200',
                  'bg-green-100 border-green-200',
                  'bg-purple-100 border-purple-200',
                  'bg-pink-100 border-pink-200',
                  'bg-orange-100 border-orange-200',
                  'bg-teal-100 border-teal-200',
                ]
                const randomColor = colors[Math.floor(Math.random() * colors.length)]

                return (
                  <div
                    key={board.id}
                    className={`border rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] ${randomColor}`}
                    onClick={() => handleBoardClick(board.id)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-800 truncate">{board.name}</h3>
                      <button
                        onClick={(e) => handleDeleteBoard(e, board.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Delete board"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(board.createdAt)}</span>
                    </div>
                    
                    <div className="flex space-x-4 mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center">
                        <span className="bg-white rounded-full w-8 h-8 flex items-center justify-center mr-2 shadow-sm">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </span>
                        <span className="text-sm font-medium">{board.columns.length} columns</span>
                      </div>
                      <div className="flex items-center">
                        <span className="bg-white rounded-full w-8 h-8 flex items-center justify-center mr-2 shadow-sm">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                        </span>
                        <span className="text-sm font-medium">{totalTasks} tasks</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="flex justify-center mt-8">
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Another Board
              </Button>
            </div>
          </div>
        )}
      </div>

      <CreateBoardModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  )
}