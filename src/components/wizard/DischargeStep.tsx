import { useState } from "react"
import { useFormStore } from "../../lib/store"
import { dischargeSchema } from "../../lib/types"
import type { DischargeData } from "../../lib/types"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export function DischargeStep() {
  const { discharge, updateDischarge } = useFormStore()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      dischargeSchema.parse(discharge)
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

  const handleChange = (field: keyof DischargeData, value: string) => {
    updateDischarge({ [field]: value })
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Discharge Planning</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Follow-up Appointments</h3>
              
              <div className="space-y-2">
                <Label htmlFor="ablativeFollowUp">Ablative Surgeon Follow-up</Label>
                <Input
                  id="ablativeFollowUp"
                  value={discharge.ablativeFollowUp || ""}
                  onChange={(e) => handleChange("ablativeFollowUp", e.target.value)}
                  placeholder="e.g., 2 weeks"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reconstructiveFollowUp">Reconstructive Surgeon Follow-up</Label>
                <Input
                  id="reconstructiveFollowUp"
                  value={discharge.reconstructiveFollowUp || ""}
                  onChange={(e) => handleChange("reconstructiveFollowUp", e.target.value)}
                  placeholder="e.g., 1 week"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Home Care Instructions</h3>
              
              <div className="space-y-2">
                <Label htmlFor="dressingChanges">Dressing Changes</Label>
                <Textarea
                  id="dressingChanges"
                  value={discharge.dressingChanges || ""}
                  onChange={(e) => handleChange("dressingChanges", e.target.value)}
                  placeholder="Enter dressing change instructions"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="physicalTherapy">Physical Therapy</Label>
                <Textarea
                  id="physicalTherapy"
                  value={discharge.physicalTherapy || ""}
                  onChange={(e) => handleChange("physicalTherapy", e.target.value)}
                  placeholder="Enter PT instructions and restrictions"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Instructions</h3>
            
            <div className="space-y-2">
              <Label htmlFor="homeCare">Home Care Instructions</Label>
              <Textarea
                id="homeCare"
                value={discharge.homeCare || ""}
                onChange={(e) => handleChange("homeCare", e.target.value)}
                placeholder="Enter general home care instructions"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
              <Textarea
                id="dietaryRestrictions"
                value={discharge.dietaryRestrictions || ""}
                onChange={(e) => handleChange("dietaryRestrictions", e.target.value)}
                placeholder="Enter dietary restrictions and feeding instructions"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicationInstructions">Medication Instructions</Label>
              <Textarea
                id="medicationInstructions"
                value={discharge.medicationInstructions || ""}
                onChange={(e) => handleChange("medicationInstructions", e.target.value)}
                placeholder="Enter medication instructions and dosing"
                rows={3}
              />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}



