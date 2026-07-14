import { useContext } from 'react'
import { ToastContext } from "@/context/ToastContext.jsx"

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast harus dipakai di dalam <ToastProvider>')
  return ctx.toast
}

export function useToastList() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToastList harus dipakai di dalam <ToastProvider>')
  return ctx
}
