import { create } from 'zustand'

const useUIStore = create((set, get) => ({
  // State
  notifications: [],
  modals: {
    productModal: { isOpen: false, product: null },
    authModal: { isOpen: false, mode: 'login' }, // login, register
    cartModal: { isOpen: false },
    confirmModal: { isOpen: false, title: '', message: '', onConfirm: null },
  },
  loading: {
    global: false,
    products: false,
    orders: false,
    auth: false,
  },
  theme: 'light',
  sidebarOpen: false,

  // Notification Actions
  addNotification: (notification) => {
    const id = Date.now().toString()
    const newNotification = {
      id,
      type: 'info', // info, success, warning, error
      duration: 5000,
      ...notification,
    }
    
    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }))

    // Auto remove notification
    if (newNotification.duration > 0) {
      setTimeout(() => {
        get().removeNotification(id)
      }, newNotification.duration)
    }

    return id
  },

  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),

  clearNotifications: () => set({ notifications: [] }),

  // Modal Actions
  openModal: (modalName, data = {}) => set((state) => ({
    modals: {
      ...state.modals,
      [modalName]: { ...state.modals[modalName], isOpen: true, ...data }
    }
  })),

  closeModal: (modalName) => set((state) => ({
    modals: {
      ...state.modals,
      [modalName]: { ...state.modals[modalName], isOpen: false }
    }
  })),

  closeAllModals: () => set((state) => {
    const closedModals = {}
    Object.keys(state.modals).forEach(key => {
      closedModals[key] = { ...state.modals[key], isOpen: false }
    })
    return { modals: closedModals }
  }),

  // Loading Actions
  setLoading: (key, isLoading) => set((state) => ({
    loading: { ...state.loading, [key]: isLoading }
  })),

  setGlobalLoading: (isLoading) => set((state) => ({
    loading: { ...state.loading, global: isLoading }
  })),

  // Theme Actions
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light'
  })),

  setTheme: (theme) => set({ theme }),

  // Sidebar Actions
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  openSidebar: () => set({ sidebarOpen: true }),
  
  closeSidebar: () => set({ sidebarOpen: false }),

  // Utility Actions
  showSuccess: (message, title = 'Success') => get().addNotification({
    type: 'success',
    title,
    message,
  }),

  showError: (message, title = 'Error') => get().addNotification({
    type: 'error',
    title,
    message,
    duration: 8000,
  }),

  showWarning: (message, title = 'Warning') => get().addNotification({
    type: 'warning',
    title,
    message,
  }),

  showInfo: (message, title = 'Info') => get().addNotification({
    type: 'info',
    title,
    message,
  }),
}))

export { useUIStore }
export default useUIStore