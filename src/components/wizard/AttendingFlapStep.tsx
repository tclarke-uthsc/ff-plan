import { useState } from "react"
import { useFormStore } from "../../lib/store"
import { attendingFlapSchema } from "../../lib/types"
import type { AttendingFlapData, FlapType } from "../../lib/types"
import { SURGEON_OPTIONS, FLAP_OPTIONS } from "../../lib/config"
import { Select } from "../ui/select"
import { Label } from "../ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

const FLAP_TYPES: { value: FlapType; label: string }[] = FLAP_OPTIONS.map(flap => ({
  value: flap,
  label: flap === "ALT" ? "ALT (Anterolateral Thigh)" :
         flap === "RFFF" ? "RFFF (Radial Forearm Free Flap)" :
         flap
}))

export function AttendingFlapStep() {
  const { attendingFlap, updateAttendingFlap } = useFormStore()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      attendingFlapSchema.parse(attendingFlap)
      setErrors({})
      // Form is valid, parent will handle navigation
    } catch (error: any) {
      const newErrors: Record<string, string> = {}
      error.errors?.forEach((err: any) => {
        newErrors[err.path[0]] = err.message
      })
      setErrors(newErrors)
    }
  }

  const handleChange = (field: keyof AttendingFlapData, value: string) => {
    updateAttendingFlap({ [field]: value })
    // Clear error when user makes selection
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Attending & Flap Type</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="flap">Flap Type *</Label>
            <Select
              id="flap"
              value={attendingFlap.flap || ""}
              onChange={(e) => handleChange("flap", e.target.value as FlapType)}
              className={errors.flap ? "border-red-500" : ""}
            >
              <option value="">Select flap type</option>
              {FLAP_TYPES.map((flap) => (
                <option key={flap.value} value={flap.value}>
                  {flap.label}
                </option>
              ))}
            </Select>
            {errors.flap && <p className="text-sm text-red-500">{errors.flap}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ablativeSurgeon">Ablative Surgeon *</Label>
              <Select
                id="ablativeSurgeon"
                value={attendingFlap.ablativeSurgeon || ""}
                onChange={(e) => handleChange("ablativeSurgeon", e.target.value)}
                className={errors.ablativeSurgeon ? "border-red-500" : ""}
              >
                <option value="">Select ablative surgeon</option>
                {SURGEON_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Select>
              {errors.ablativeSurgeon && <p className="text-sm text-red-500">{errors.ablativeSurgeon}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reconstructiveSurgeon">Reconstructive Surgeon *</Label>
              <Select
                id="reconstructiveSurgeon"
                value={attendingFlap.reconstructiveSurgeon || ""}
                onChange={(e) => handleChange("reconstructiveSurgeon", e.target.value)}
                className={errors.reconstructiveSurgeon ? "border-red-500" : ""}
              >
                <option value="">Select reconstructive surgeon</option>
                {SURGEON_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Select>
              {errors.reconstructiveSurgeon && <p className="text-sm text-red-500">{errors.reconstructiveSurgeon}</p>}
            </div>
          </div>

          {/* Show flap-specific information */}
          {attendingFlap.flap && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Flap Information</h4>
              <p className="text-sm text-blue-800">
                {getFlapDescription(attendingFlap.flap)}
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

function getFlapDescription(flap: FlapType): string {
  switch (flap) {
    case "ALT":
      return "Anterolateral Thigh flap - commonly used for large soft tissue defects, provides good bulk and skin paddle."
    case "Fibula":
      return "Fibula flap - primarily used for mandibular reconstruction, provides both bone and soft tissue."
    case "RFFF":
      return "Radial Forearm Free Flap - thin, pliable flap ideal for oral cavity and pharyngeal reconstruction."
    case "Scapula":
      return "Scapula flap - provides both bone and soft tissue, useful for complex reconstructions."
    case "Jejunal":
      return "Jejunal flap - used for circumferential pharyngeal reconstruction, provides mucosal lining."
    case "Other":
      return "Other flap type - please specify in the intraoperative section."
    default:
      return ""
  }
}
