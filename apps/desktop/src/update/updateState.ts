import { create } from "zustand"
import { persist } from "zustand/middleware"
import { nanoid } from "nanoid"

export type UpdateEntry = {
  id: string
  version: string
  description: string
  date: string
  changes: string[]
  type: "feature" | "bugfix" | "improvement"
}

type UpdateState = {
  updates: UpdateEntry[]
  addUpdate: (entry: Omit<UpdateEntry, "id" | "date">) => void
  clearUpdates: () => void
}

export const useUpdates = create<UpdateState>()(
  persist(
    (set, get) => ({
      updates: [],

      addUpdate: (entry) =>
        set((state) => ({
          updates: [
            {
              id: nanoid(),
              date: new Date().toISOString(),
              ...entry,
            },
            ...state.updates,
          ],
        })),

      clearUpdates: () => set({ updates: [] }),
    }),
    { name: "9td_updates" }
  )
)
