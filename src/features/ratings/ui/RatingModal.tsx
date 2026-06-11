'use client'

import { useState, useEffect } from 'react'

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (rating: number, comment: string) => Promise<void>
  routeName: string
}

export function RatingModal({ isOpen, onClose, onSubmit, routeName }: RatingModalProps) {
  const [selectedRating, setSelectedRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Сброс формы при открытии
  useEffect(() => {
    if (isOpen) {
      setSelectedRating(0)
      setHoveredRating(0)
      setComment('')
      setShowSuccess(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedRating === 0) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(selectedRating, comment)
      // Показываем успех
      setShowSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={onClose}
      style={{
        animation: 'fadeIn 0.3s ease-out forwards'
      }}
    >
      <div
        className="bg-white rounded-[20px] max-w-[500px] w-full shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        {/* Декоративный элемент */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center p-8 pb-6 border-b border-gray-50">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">
            оцените маршрут
          </p>
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight leading-tight">
            {routeName}
          </h2>
        </div>

        {/* Success State */}
        {showSuccess ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Спасибо!</h3>
            <p className="text-gray-600">Ваша оценка успешно сохранена</p>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-8">
          {/* Звезды */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide mb-6 text-center">
              Ваша оценка
            </label>
            <div className="flex justify-center gap-3 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-all duration-200 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 rounded-full p-1"
                >
                  <svg
                    className={`w-10 h-10 transition-all duration-300 ${
                      star <= (hoveredRating || selectedRating)
                        ? 'fill-yellow-400 text-yellow-400 drop-shadow-lg scale-110 animate-pulse'
                        : 'fill-none text-gray-300 hover:text-gray-400'
                    }`}
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              ))}
            </div>
            {selectedRating > 0 && (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-full border border-yellow-200">
                  <span className="text-2xl">
                    {selectedRating === 5 && '⭐'}
                    {selectedRating === 4 && '😊'}
                    {selectedRating === 3 && '👍'}
                    {selectedRating === 2 && '😐'}
                    {selectedRating === 1 && '😞'}
                  </span>
                  <span className="text-sm font-bold text-yellow-800">
                    {selectedRating === 5 && 'Отлично!'}
                    {selectedRating === 4 && 'Хорошо'}
                    {selectedRating === 3 && 'Нормально'}
                    {selectedRating === 2 && 'Так себе'}
                    {selectedRating === 1 && 'Плохо'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Комментарий */}
          <div className="mb-8">
            <label htmlFor="comment" className="block text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
              Комментарий <span className="text-gray-400 font-normal">(опционально)</span>
            </label>
            <div className="relative">
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 500))}
                rows={4}
                className="w-full px-4 py-4 rounded-[12px] border border-gray-200 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all text-gray-900 resize-none placeholder-gray-400"
                placeholder="Расскажите, что вам понравилось или не понравилось в этом маршруте..."
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                {comment.length}/500
              </div>
            </div>
          </div>

          {/* Кнопка отправки */}
          <button
            type="submit"
            disabled={isSubmitting || selectedRating === 0}
            className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 rounded-[12px] font-bold text-sm uppercase tracking-wide hover:from-gray-800 hover:to-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-gray-900 disabled:hover:to-gray-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Отправка оценки...
              </div>
            ) : (
              'Отправить оценку'
            )}
          </button>
        </form>
        )}
      </div>
    </div>
  )
}
