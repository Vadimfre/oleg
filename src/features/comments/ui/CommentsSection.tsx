'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/features/auth'
import { commentSchema, type CommentFormData } from '@/shared/lib/validations'
import { FormTextarea } from '@/shared/ui/FormField'
import { Comment, createComment, getRouteComments, deleteComment } from '../model/comments.api'

interface CommentsSectionProps {
  routeId: string
  routeName: string
}

export function CommentsSection({ routeId, routeName }: CommentsSectionProps) {
  const { user, isAuthenticated } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: { text: '' },
  })

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

  const onSubmit = async (data: CommentFormData) => {
    if (!isAuthenticated) return

    setSubmitError(null)
    try {
      await createComment(routeId, data.text.trim())
      reset()
      await loadComments()
    } catch (error: unknown) {
      setSubmitError(error instanceof Error ? error.message : 'Не удалось отправить комментарий')
    }
  }

  const handleDelete = async (commentId: number) => {
    try {
      await deleteComment(commentId)
      await loadComments()
    } catch (error: unknown) {
      console.error('Delete comment error:', error)
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

      <div className="bg-white rounded-[12px] border border-gray-100 p-6 mb-6">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormTextarea
            label={
              isAuthenticated
                ? 'Оставьте свой комментарий'
                : 'Войдите, чтобы оставить комментарий'
            }
            rows={4}
            disabled={!isAuthenticated}
            placeholder={
              isAuthenticated
                ? 'Поделитесь своими впечатлениями о маршруте...'
                : 'Войдите в аккаунт'
            }
            error={errors.text?.message}
            maxLength={1000}
            {...register('text')}
          />
          {submitError && (
            <p className="text-xs text-red-500 mb-3">{submitError}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !isAuthenticated}
            className="px-6 py-3 bg-gray-900 text-white text-sm font-bold rounded-[8px] hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Отправка...' : 'Отправить'}
          </button>
        </form>
      </div>

      {isLoading ? (
        <p className="text-gray-500 text-center py-8">Загрузка комментариев...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Пока нет комментариев к «{routeName}». Будьте первым!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white rounded-[12px] border border-gray-100 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-bold text-gray-900 mb-1">
                    {comment.user?.name || 'Пользователь'}
                  </div>
                  <div className="text-xs text-gray-400 mb-3">
                    {formatDate(comment.createdAt)}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{comment.text}</p>
                </div>
                {user?.id === comment.user.id && (
                  <button
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium flex-shrink-0"
                  >
                    Удалить
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
