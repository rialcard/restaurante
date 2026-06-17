import { createContext, useCallback, useContext, useState } from 'react'

const ToastContext = createContext(null)

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info') => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4500)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider')
  return ctx
}

function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

function Toast({ toast, onRemove }) {
  const icons = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
  }
  const styles = {
    success: 'border-secondary-container/50 bg-surface-container-high',
    error: 'border-error/50 bg-error-container/20',
    info: 'border-outline-variant bg-surface-container-high',
  }
  const iconColors = {
    success: 'text-secondary-container',
    error: 'text-error',
    info: 'text-on-surface-variant',
  }

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border shadow-ambient-lg animate-fade-in ${styles[toast.type]}`}
    >
      <span className={`icon text-xl flex-shrink-0 mt-0.5 ${iconColors[toast.type]}`}>
        {icons[toast.type]}
      </span>
      <p className="text-body-md text-on-surface flex-1 font-body">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <span className="icon text-xl">close</span>
      </button>
    </div>
  )
}
