import { z } from "zod"

export const attendingSchema = z.enum(["Gleysteen", "Eid", "Wood"])
export const flapTypeSchema = z.enum(["ALT", "Fibula", "RFFF", "Scapula", "Jejunal", "LatissimusDorsi", "Other"])
export const yesNoSchema = z.enum(["Yes", "No"])

export const patientSchema = z.object({
  name: z.string().min(1, "Patient name is required"),
  mrn: z.string().min(1, "MRN is required"),
  date: z.string().min(1, "Date is required"),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  plannedProcedures: z.string().min(1, "Planned procedures are required"),
})

export const attendingFlapSchema = z.object({
  flap: flapTypeSchema,
  ablativeSurgeon: z.string().min(1, "Ablative surgeon is required"),
  reconstructiveSurgeon: z.string().min(1, "Reconstructive surgeon is required"),
})

export const modifiersSchema = z.object({
  oralCavityAerodigestive: z.boolean(),
  laryngectomy: z.boolean(),
  priorRadiation: z.boolean(),
  diabetes: z.boolean(),
  tracheostomy: z.boolean(),
  traumaRecon: z.boolean(),
  gTube: z.boolean(),
})

export const intraopSchema = z.object({
  anticipatedAirway: z.string().min(1, "Anticipated airway is required"),
  ettPosition: z.string().min(1, "ETT position is required"),
  protectedLimbs: z.string().min(1, "Protected limbs is required"),
  paralyticOk: yesNoSchema,
  pressorsOk: yesNoSchema,
  preopAbx: z.string().min(1, "Preoperative antibiotics are required"),
  expectedBloodLoss: z.string().min(1, "Expected blood loss is required"),
  patientPosition: z.string().min(1, "Patient position is required"),
  tablePosition: z.string().min(1, "Table position is required"),
  numberOfSetups: z.string().min(1, "Number of setups is required"),
  saw: yesNoSchema,
  drill: yesNoSchema,
  hnPlating: yesNoSchema,
  extremityPlating: yesNoSchema,
  platingCompany: z.string().optional(),
  stsg: yesNoSchema,
  anticipatedTrachSize: z.string().optional(),
  woundVac: yesNoSchema,
})


export const dischargeSchema = z.object({
  ablativeFollowUp: z.string().optional(),
  reconstructiveFollowUp: z.string().optional(),
  homeCare: z.string().optional(),
  dressingChanges: z.string().optional(),
  physicalTherapy: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  medicationInstructions: z.string().optional(),
})

export const formSchema = z.object({
  patient: patientSchema,
  attendingFlap: attendingFlapSchema,
  modifiers: modifiersSchema,
  intraop: intraopSchema,
  discharge: dischargeSchema,
})

export type Attending = z.infer<typeof attendingSchema>
export type FlapType = z.infer<typeof flapTypeSchema>
export type YesNo = z.infer<typeof yesNoSchema>
export type PatientData = z.infer<typeof patientSchema>
export type AttendingFlapData = z.infer<typeof attendingFlapSchema>
export type ModifiersData = z.infer<typeof modifiersSchema>
export type IntraopData = z.infer<typeof intraopSchema>
export type DischargeData = z.infer<typeof dischargeSchema>
export type FormData = z.infer<typeof formSchema>
