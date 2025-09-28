import { useState } from "react"
import { useFormStore } from "../../lib/store"
import { patientSchema } from "../../lib/types"
import type { PatientData } from "../../lib/types"
import { COMMON_PROCEDURES } from "../../lib/config"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { X } from "lucide-react"




export function PatientStep() {
  const { patient, updatePatient } = useFormStore()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [procedureInput, setProcedureInput] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      patientSchema.parse(patient)
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

  const handleChange = (field: keyof PatientData, value: string) => {
    updatePatient({ [field]: value })
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const getProcedures = (): string[] => {
    return patient.plannedProcedures ? patient.plannedProcedures.split(',').map(p => p.trim()).filter(p => p) : []
  }

  const addProcedure = (procedure: string) => {
    const currentProcedures = getProcedures()
    if (!currentProcedures.includes(procedure)) {
      const newProcedures = [...currentProcedures, procedure].join(', ')
      updatePatient({ plannedProcedures: newProcedures })
    }
    setProcedureInput("")
    setShowSuggestions(false)
  }

  const removeProcedure = (procedureToRemove: string) => {
    const currentProcedures = getProcedures()
    const newProcedures = currentProcedures.filter(p => p !== procedureToRemove).join(', ')
    updatePatient({ plannedProcedures: newProcedures })
  }

  const getFilteredSuggestions = () => {
    if (!procedureInput) return COMMON_PROCEDURES.slice(0, 10)
    return COMMON_PROCEDURES
      .filter(proc => proc.toLowerCase().includes(procedureInput.toLowerCase()))
      .slice(0, 10)
  }

  // Set default date to today
  const today = new Date().toISOString().split('T')[0]
  const currentDate = patient.date || today

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Patient Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Patient Name *</Label>
              <Input
                id="name"
                value={patient.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                className={errors.name ? "border-red-500" : ""}
                placeholder="Enter patient name"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mrn">MRN *</Label>
              <Input
                id="mrn"
                value={patient.mrn || ""}
                onChange={(e) => handleChange("mrn", e.target.value)}
                className={errors.mrn ? "border-red-500" : ""}
                placeholder="Enter MRN"
              />
              {errors.mrn && <p className="text-sm text-red-500">{errors.mrn}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={currentDate}
              onChange={(e) => handleChange("date", e.target.value)}
              className={errors.date ? "border-red-500" : ""}
            />
            {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnosis">HPI (History of Present Illness) *</Label>
            <Input
              id="diagnosis"
              value={patient.diagnosis || ""}
              onChange={(e) => handleChange("diagnosis", e.target.value)}
              className={errors.diagnosis ? "border-red-500" : ""}
              placeholder="Enter HPI"
            />
            {errors.diagnosis && <p className="text-sm text-red-500">{errors.diagnosis}</p>}
          </div>




          <div className="space-y-2">
            <Label htmlFor="plannedProcedures">Planned Procedures *</Label>
            
            {/* Selected Procedures as Chips */}
            {getProcedures().length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {getProcedures().map((procedure, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1 text-xs">
                    <span className="truncate max-w-[200px]">{procedure}</span>
                    <button
                      type="button"
                      onClick={() => removeProcedure(procedure)}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5 flex-shrink-0"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Autocomplete Input */}
            <div className="relative">
              <Input
                id="plannedProcedures"
                value={procedureInput}
                onChange={(e) => {
                  setProcedureInput(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    if (procedureInput.trim()) {
                      addProcedure(procedureInput.trim())
                    }
                  }
                }}
                placeholder="Type to search procedures or press Enter to add"
                className={errors.plannedProcedures ? "border-red-500" : ""}
              />
              
              {/* Suggestions Dropdown */}
              {showSuggestions && getFilteredSuggestions().length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {getFilteredSuggestions().map((procedure, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      onClick={() => addProcedure(procedure)}
                    >
                      {procedure}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {errors.plannedProcedures && <p className="text-sm text-red-500">{errors.plannedProcedures}</p>}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
