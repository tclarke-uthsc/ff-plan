import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { FormData, PatientData, AttendingFlapData, ModifiersData, IntraopData, DischargeData } from "./types"

interface FormStore {
  // Form data
  patient: Partial<PatientData>
  attendingFlap: Partial<AttendingFlapData>
  modifiers: Partial<ModifiersData>
  intraop: Partial<IntraopData>
  discharge: Partial<DischargeData>
  
  // UI state
  currentStep: number
  isGenerating: boolean
  generatedNotes: {
    planOfDay: string
    postOpCourse: string
    progressNote: string
  } | null
  
  // Actions
  updatePatient: (data: Partial<PatientData>) => void
  updateAttendingFlap: (data: Partial<AttendingFlapData>) => void
  updateModifiers: (data: Partial<ModifiersData>) => void
  updateIntraop: (data: Partial<IntraopData>) => void
  updateDischarge: (data: Partial<DischargeData>) => void
  setCurrentStep: (step: number) => void
  setGenerating: (generating: boolean) => void
  setGeneratedNotes: (notes: { planOfDay: string; postOpCourse: string; progressNote: string }) => void
  reset: () => void
}

const initialState = {
  patient: {},
  attendingFlap: {},
  modifiers: {},
  intraop: {},
  discharge: {},
  currentStep: 0,
  isGenerating: false,
  generatedNotes: null,
}

export const useFormStore = create<FormStore>()(
  persist(
    (set) => ({
      ...initialState,
      
      updatePatient: (data) => set((state) => ({ 
        patient: { ...state.patient, ...data } 
      })),
      
      updateAttendingFlap: (data) => set((state) => ({ 
        attendingFlap: { ...state.attendingFlap, ...data } 
      })),
      
      updateModifiers: (data) => set((state) => ({ 
        modifiers: { ...state.modifiers, ...data } 
      })),
      
      updateIntraop: (data) => set((state) => ({
        intraop: { ...state.intraop, ...data }
      })),

      updateDischarge: (data) => set((state) => ({
        discharge: { ...state.discharge, ...data }
      })),
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      setGenerating: (generating) => set({ isGenerating: generating }),
      
      setGeneratedNotes: (notes) => set({ generatedNotes: notes }),
      
      reset: () => set(initialState),
    }),
        {
          name: "ff-plan-storage",
          partialize: (state) => ({
            patient: state.patient,
            attendingFlap: state.attendingFlap,
            modifiers: state.modifiers,
            intraop: state.intraop,
            discharge: state.discharge,
          }),
        }
  )
)
