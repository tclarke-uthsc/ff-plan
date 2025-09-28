import { useState } from "react"
import { useFormStore } from "../../lib/store"
import { intraopSchema } from "../../lib/types"
import type { IntraopData, YesNo } from "../../lib/types"
import { 
  ETT_POSITION_OPTIONS, 
  TABLE_POSITION_OPTIONS,
  YES_NO_OPTIONS,
  AIRWAY_OPTIONS,
  LIMB_PROTECTION_OPTIONS,
  PATIENT_POSITION_OPTIONS,
  ANTIBIOTIC_OPTIONS,
  BLOOD_LOSS_OPTIONS,
  NUMBER_OF_SETUPS_OPTIONS,
  PLATING_COMPANY_OPTIONS,
  TRACHEOSTOMY_SIZE_OPTIONS
} from "../../lib/config"
import { Select } from "../ui/select"
import { Label } from "../ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

const YES_NO_OPTIONS_FORMATTED: { value: YesNo; label: string }[] = YES_NO_OPTIONS.map(option => ({
  value: option,
  label: option
}))

export function IntraopStep() {
  const { intraop, updateIntraop, modifiers } = useFormStore()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      intraopSchema.parse(intraop)
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

  const handleChange = (field: keyof IntraopData, value: string) => {
    updateIntraop({ [field]: value })
    // Clear error when user makes selection
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Intraoperative Planning</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Anesthesia Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Anesthesia</h3>
              
              <div className="space-y-2">
                <Label htmlFor="anticipatedAirway">Anticipated Airway *</Label>
                <Select
                  id="anticipatedAirway"
                  value={intraop.anticipatedAirway || ""}
                  onChange={(e) => handleChange("anticipatedAirway", e.target.value)}
                  className={errors.anticipatedAirway ? "border-red-500" : ""}
                >
                  <option value="">Select airway</option>
                  {AIRWAY_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Select>
                {errors.anticipatedAirway && <p className="text-sm text-red-500">{errors.anticipatedAirway}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ettPosition">ETT Position *</Label>
                <Select
                  id="ettPosition"
                  value={intraop.ettPosition || ""}
                  onChange={(e) => handleChange("ettPosition", e.target.value)}
                  className={errors.ettPosition ? "border-red-500" : ""}
                >
                  <option value="">Select ETT position</option>
                  {ETT_POSITION_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Select>
                {errors.ettPosition && <p className="text-sm text-red-500">{errors.ettPosition}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="protectedLimbs">Protected Limbs *</Label>
                <Select
                  id="protectedLimbs"
                  value={intraop.protectedLimbs || ""}
                  onChange={(e) => handleChange("protectedLimbs", e.target.value)}
                  className={errors.protectedLimbs ? "border-red-500" : ""}
                >
                  <option value="">Select protected limbs</option>
                  {LIMB_PROTECTION_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Select>
                {errors.protectedLimbs && <p className="text-sm text-red-500">{errors.protectedLimbs}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paralyticOk">Paralytic OK *</Label>
                  <Select
                    id="paralyticOk"
                    value={intraop.paralyticOk || ""}
                    onChange={(e) => handleChange("paralyticOk", e.target.value as YesNo)}
                    className={errors.paralyticOk ? "border-red-500" : ""}
                  >
                    <option value="">Select</option>
                    {YES_NO_OPTIONS_FORMATTED.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </Select>
                  {errors.paralyticOk && <p className="text-sm text-red-500">{errors.paralyticOk}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pressorsOk">Pressors OK *</Label>
                  <Select
                    id="pressorsOk"
                    value={intraop.pressorsOk || ""}
                    onChange={(e) => handleChange("pressorsOk", e.target.value as YesNo)}
                    className={errors.pressorsOk ? "border-red-500" : ""}
                  >
                    <option value="">Select</option>
                    {YES_NO_OPTIONS_FORMATTED.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </Select>
                  {errors.pressorsOk && <p className="text-sm text-red-500">{errors.pressorsOk}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preopAbx">Preoperative Antibiotics *</Label>
                <Select
                  id="preopAbx"
                  value={intraop.preopAbx || ""}
                  onChange={(e) => handleChange("preopAbx", e.target.value)}
                  className={errors.preopAbx ? "border-red-500" : ""}
                >
                  <option value="">Select antibiotics</option>
                  {ANTIBIOTIC_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Select>
                {errors.preopAbx && <p className="text-sm text-red-500">{errors.preopAbx}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedBloodLoss">Expected Blood Loss *</Label>
                <Select
                  id="expectedBloodLoss"
                  value={intraop.expectedBloodLoss || ""}
                  onChange={(e) => handleChange("expectedBloodLoss", e.target.value)}
                  className={errors.expectedBloodLoss ? "border-red-500" : ""}
                >
                  <option value="">Select expected blood loss</option>
                  {BLOOD_LOSS_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Select>
                {errors.expectedBloodLoss && <p className="text-sm text-red-500">{errors.expectedBloodLoss}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientPosition">Patient Position *</Label>
                  <Select
                    id="patientPosition"
                    value={intraop.patientPosition || ""}
                    onChange={(e) => handleChange("patientPosition", e.target.value)}
                    className={errors.patientPosition ? "border-red-500" : ""}
                  >
                    <option value="">Select position</option>
                    {PATIENT_POSITION_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </Select>
                  {errors.patientPosition && <p className="text-sm text-red-500">{errors.patientPosition}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tablePosition">Table Position *</Label>
                  <Select
                    id="tablePosition"
                    value={intraop.tablePosition || ""}
                    onChange={(e) => handleChange("tablePosition", e.target.value)}
                    className={errors.tablePosition ? "border-red-500" : ""}
                  >
                    <option value="">Select table position</option>
                    {TABLE_POSITION_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </Select>
                  {errors.tablePosition && <p className="text-sm text-red-500">{errors.tablePosition}</p>}
                </div>
              </div>
            </div>

            {/* Nursing Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Nursing & Equipment</h3>
              
              <div className="space-y-2">
                <Label htmlFor="numberOfSetups">Number of Setups *</Label>
                <Select
                  id="numberOfSetups"
                  value={intraop.numberOfSetups || ""}
                  onChange={(e) => handleChange("numberOfSetups", e.target.value)}
                  className={errors.numberOfSetups ? "border-red-500" : ""}
                >
                  <option value="">Select number of setups</option>
                  {NUMBER_OF_SETUPS_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Select>
                {errors.numberOfSetups && <p className="text-sm text-red-500">{errors.numberOfSetups}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="saw">Saw *</Label>
                  <Select
                    id="saw"
                    value={intraop.saw || ""}
                    onChange={(e) => handleChange("saw", e.target.value as YesNo)}
                    className={errors.saw ? "border-red-500" : ""}
                  >
                    <option value="">Select</option>
                    {YES_NO_OPTIONS_FORMATTED.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </Select>
                  {errors.saw && <p className="text-sm text-red-500">{errors.saw}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="drill">Drill *</Label>
                  <Select
                    id="drill"
                    value={intraop.drill || ""}
                    onChange={(e) => handleChange("drill", e.target.value as YesNo)}
                    className={errors.drill ? "border-red-500" : ""}
                  >
                    <option value="">Select</option>
                    {YES_NO_OPTIONS_FORMATTED.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </Select>
                  {errors.drill && <p className="text-sm text-red-500">{errors.drill}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hnPlating">H&N Plating *</Label>
                  <Select
                    id="hnPlating"
                    value={intraop.hnPlating || ""}
                    onChange={(e) => handleChange("hnPlating", e.target.value as YesNo)}
                    className={errors.hnPlating ? "border-red-500" : ""}
                  >
                    <option value="">Select</option>
                    {YES_NO_OPTIONS_FORMATTED.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </Select>
                  {errors.hnPlating && <p className="text-sm text-red-500">{errors.hnPlating}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="extremityPlating">Extremity Plating *</Label>
                  <Select
                    id="extremityPlating"
                    value={intraop.extremityPlating || ""}
                    onChange={(e) => handleChange("extremityPlating", e.target.value as YesNo)}
                    className={errors.extremityPlating ? "border-red-500" : ""}
                  >
                    <option value="">Select</option>
                    {YES_NO_OPTIONS_FORMATTED.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </Select>
                  {errors.extremityPlating && <p className="text-sm text-red-500">{errors.extremityPlating}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="platingCompany">Plating Company</Label>
                <Select
                  id="platingCompany"
                  value={intraop.platingCompany || ""}
                  onChange={(e) => handleChange("platingCompany", e.target.value)}
                >
                  <option value="">Select plating company</option>
                  {PLATING_COMPANY_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stsg">STSG *</Label>
                  <Select
                    id="stsg"
                    value={intraop.stsg || ""}
                    onChange={(e) => handleChange("stsg", e.target.value as YesNo)}
                    className={errors.stsg ? "border-red-500" : ""}
                  >
                    <option value="">Select</option>
                    {YES_NO_OPTIONS_FORMATTED.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </Select>
                  {errors.stsg && <p className="text-sm text-red-500">{errors.stsg}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="woundVac">Wound Vac *</Label>
                  <Select
                    id="woundVac"
                    value={intraop.woundVac || ""}
                    onChange={(e) => handleChange("woundVac", e.target.value as YesNo)}
                    className={errors.woundVac ? "border-red-500" : ""}
                  >
                    <option value="">Select</option>
                    {YES_NO_OPTIONS_FORMATTED.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </Select>
                  {errors.woundVac && <p className="text-sm text-red-500">{errors.woundVac}</p>}
                </div>
              </div>

              {/* Show trach size field if laryngectomy is selected */}
              {modifiers.laryngectomy && (
                <div className="space-y-2">
                  <Label htmlFor="anticipatedTrachSize">Anticipated Trach Size</Label>
                  <Select
                    id="anticipatedTrachSize"
                    value={intraop.anticipatedTrachSize || "6UN75H"}
                    onChange={(e) => handleChange("anticipatedTrachSize", e.target.value)}
                  >
                    {TRACHEOSTOMY_SIZE_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </Select>
                </div>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
