// src/state/ui.ts
import { create } from "zustand"
import { nanoid } from "nanoid"

// Toast notification types
type ToastType = "success" | "error" | "info"

type Toast = {
  id: string
  title: string
  message: string
  type: ToastType
}

// UI state for modals and sidebar
type UIState = {
  showCreateModal: boolean
  showSettingsModal: boolean
  sidebarOpen: boolean
  setShowCreateModal: (v: boolean) => void
  setShowSettingsModal: (v: boolean) => void
  toggleSidebar: () => void
  setSidebarOpen: (v: boolean) => void
}

// Toaster state for showing notifications
type ToasterState = {
  toasts: Toast[]
  pushToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

// --- UI STORE ---
export const useUI = create<UIState>((set) => ({
  showCreateModal: false,
  showSettingsModal: false,
  sidebarOpen: true,

  setShowCreateModal: (v) => set({ showCreateModal: v }),
  setShowSettingsModal: (v) => set({ showSettingsModal: v }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
}))

// --- TOASTER STORE ---
export const useToaster = create<ToasterState>((set, get) => ({
  toasts: [],

  pushToast: (toast) => {
    const id = nanoid()
    set({ toasts: [...get().toasts, { id, ...toast }] })

    // Auto-remove after 4 seconds
    setTimeout(() => {
      get().removeToast(id)
    }, 4000)
  },

  removeToast: (id) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) })
  },
}))
