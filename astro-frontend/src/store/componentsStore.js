import { create } from 'zustand'

export const componentStore = create ((set) => ({
    isPressed: false,
    setIsPressed: (isPressed) => set({ isPressed })
}))