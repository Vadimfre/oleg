'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/features/auth'
import { Comment, createComment, getRouteComments, deleteComment } from '../model/comments.api'

interface CommentsSectionProps {
  routeId: string
  routeName: string
}

export function CommentsSection({ routeId, routeName }: CommentsSectionProps) {
  const { user, isAuthenticated } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Загрузка комментариев
  useEffect(() => {
    loadComments()
  }, [routeId])

  const loadComments = async () => {
    try {
      const data = await getRouteComments(routeId)
      setComments(data)
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated || !newComment.trim()) {
      return
    }

    setIsSubmitting(true)
    try {
      await createComment(routeId, newComment)
      setNewComment('')
      await loadComments()
    } catch (error: any) {
      console.error('Comment error:', error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (commentId: number) => {
    try {
      await deleteComment(commentId)
      await loadComments()
    } catch (error: any) {
      console.error('Delete comment error:', error.message)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return 'Сегодня'
    if (days === 1) return 'Вчера'
    if (days < 7) return `${days} дн. назад`
    return date.toLocaleDateString('ru-RU')
  }

  return ( 
    <div className="mt-12 mb-8">
      <h2 className="text-[36px] font-black text-gray-900 uppercase tracking-tight mb-8">
        Комментарии {comments.length > 0 && `(${comments.length})`}
      </h2>

      {/* Форма добавления комментария */}
      <div className="bg-white rounded-[12px] border border-gray-100 p-6 mb-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="comment" className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">
              {isAuthenticated ? 'Оставьте свой комментарий' : 'Войдите, чтобы оставить комментарий'}
            </label>
            <textarea
              id="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={!isAuthenticated}
              rows={4}
              className="w-full px-4 py-3 rounded-[8px] border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors text-gray-900 resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder={isAuthenticated ? 'Поделитесь своими впечатлениями о маршруте...' : 'Войдите в аккаунт'}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !isAuthenticated || !newComment.trim()}
            className="bg-gray-900 text-white w-full p-3 rounded-[8px] font-bold text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Отправка...' : 'Отправить комментарий'}
          </button>
        </form>
      </div>

      {/* Список комментариев */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Загрузка комментариев...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="bg-white rounded-[12px] border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Пока нет комментариев
          </h3>
          <p className="text-gray-600">
            Станьте первым, кто оставит отзыв о маршруте «{routeName}»
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-[12px] border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-sm">
                    {comment.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{comment.user.name}</p>
                    <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                  </div>
                </div>
                {user && user.id === comment.user.id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
              <p className="text-gray-700 leading-relaxed">{comment.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
