import { useState } from "react"
import { useFormStore } from "../../lib/store"
import { modifiersSchema } from "../../lib/types"
import type { ModifiersData } from "../../lib/types"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { Select } from "../ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export function ModifiersStep() {
  const { modifiers, updateModifiers } = useFormStore()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const validatedData = modifiersSchema.parse(modifiers)
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

  const handleCheckboxChange = (field: keyof ModifiersData, checked: boolean) => {
    updateModifiers({ [field]: checked })
    // Clear error when user makes selection
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }


  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Case Modifiers</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Reconstruction Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="oralCavityAerodigestive"
                  checked={modifiers.oralCavityAerodigestive || false}
                  onChange={(e) => handleCheckboxChange("oralCavityAerodigestive", e.target.checked)}
                  className={errors.oralCavityAerodigestive ? "border-red-500" : ""}
                />
                <Label htmlFor="oralCavityAerodigestive" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Oral cavity/Aerodigestive reconstruction
                </Label>
              </div>
              {errors.oralCavityAerodigestive && <p className="text-sm text-red-500">{errors.oralCavityAerodigestive}</p>}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="laryngectomy"
                  checked={modifiers.laryngectomy || false}
                  onChange={(e) => handleCheckboxChange("laryngectomy", e.target.checked)}
                  className={errors.laryngectomy ? "border-red-500" : ""}
                />
                <Label htmlFor="laryngectomy" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Laryngectomy
                </Label>
              </div>
              {errors.laryngectomy && <p className="text-sm text-red-500">{errors.laryngectomy}</p>}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tracheostomy"
                  checked={modifiers.tracheostomy || false}
                  onChange={(e) => handleCheckboxChange("tracheostomy", e.target.checked)}
                  className={errors.tracheostomy ? "border-red-500" : ""}
                />
                <Label htmlFor="tracheostomy" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Tracheostomy
                </Label>
              </div>
              {errors.tracheostomy && <p className="text-sm text-red-500">{errors.tracheostomy}</p>}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">Medical History</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="priorRadiation"
                  checked={modifiers.priorRadiation || false}
                  onChange={(e) => handleCheckboxChange("priorRadiation", e.target.checked)}
                  className={errors.priorRadiation ? "border-red-500" : ""}
                />
                <Label htmlFor="priorRadiation" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Prior radiation
                </Label>
              </div>
              {errors.priorRadiation && <p className="text-sm text-red-500">{errors.priorRadiation}</p>}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="diabetes"
                  checked={modifiers.diabetes || false}
                  onChange={(e) => handleCheckboxChange("diabetes", e.target.checked)}
                  className={errors.diabetes ? "border-red-500" : ""}
                />
                <Label htmlFor="diabetes" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Diabetes
                </Label>
              </div>
              {errors.diabetes && <p className="text-sm text-red-500">{errors.diabetes}</p>}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="traumaRecon"
                  checked={modifiers.traumaRecon || false}
                  onChange={(e) => handleCheckboxChange("traumaRecon", e.target.checked)}
                  className={errors.traumaRecon ? "border-red-500" : ""}
                />
                <Label htmlFor="traumaRecon" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Trauma recon
                </Label>
              </div>
              {errors.traumaRecon && <p className="text-sm text-red-500">{errors.traumaRecon}</p>}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gTube"
                  checked={modifiers.gTube || false}
                  onChange={(e) => handleCheckboxChange("gTube", e.target.checked)}
                  className={errors.gTube ? "border-red-500" : ""}
                />
                <Label htmlFor="gTube" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  G tube
                </Label>
              </div>
              {errors.gTube && <p className="text-sm text-red-500">{errors.gTube}</p>}
            </div>
          </div>

          {/* Show modifier-specific information */}
          {(modifiers.oralCavityAerodigestive || modifiers.laryngectomy || modifiers.tracheostomy || 
            modifiers.priorRadiation || modifiers.diabetes || modifiers.traumaRecon || modifiers.gTube) && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">Modifier Considerations</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                {modifiers.oralCavityAerodigestive && (
                  <li>• NPO protocol will be adjusted for oral cavity reconstruction</li>
                )}
                {modifiers.laryngectomy && (
                  <li>• Tracheostomy size and esophagram timing will be specified</li>
                )}
                {modifiers.tracheostomy && (
                  <li>• Tracheostomy care protocols and SLP consultation will be added</li>
                )}
                {modifiers.priorRadiation && (
                  <li>• Extended NPO period (14 days) and adjusted healing protocols will be applied</li>
                )}
                {modifiers.diabetes && (
                  <li>• Detailed insulin management protocols will be applied</li>
                )}
                {modifiers.traumaRecon && (
                  <li>• Trauma recon pain management protocols will be applied (no Gabapentin)</li>
                )}
                {modifiers.gTube && (
                  <li>• G-tube feeding protocols will be applied</li>
                )}
              </ul>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
