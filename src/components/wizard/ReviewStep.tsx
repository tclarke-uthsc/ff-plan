import { useFormStore } from "../../lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"

export function ReviewStep() {
  const { patient, attendingFlap, modifiers, intraop } = useFormStore()

  const getModifiersText = () => {
    const mods = []
    if (modifiers.oralCavityAerodigestive) mods.push("Oral cavity/Aerodigestive")
    if (modifiers.laryngectomy) mods.push("Laryngectomy")
    if (modifiers.priorRadiation) mods.push("Prior radiation")
    return mods.length > 0 ? mods.join(", ") : "None"
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review Case Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Patient Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Patient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Name:</span> {patient.name}
              </div>
              <div>
                <span className="font-medium">MRN:</span> {patient.mrn}
              </div>
              <div>
                <span className="font-medium">Date:</span> {patient.date}
              </div>
              <div>
                <span className="font-medium">Diagnosis:</span> {patient.diagnosis}
              </div>
              <div className="md:col-span-2">
                <span className="font-medium">Planned Procedures:</span>
                <p className="mt-1 text-gray-600">{patient.plannedProcedures}</p>
              </div>
            </div>
          </div>

          {/* Attending & Flap */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Attending & Flap</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Attending:</span> {attendingFlap.attending}
              </div>
              <div>
                <span className="font-medium">Flap Type:</span> {attendingFlap.flap}
              </div>
            </div>
          </div>

          {/* Modifiers */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Modifiers</h3>
            <div className="text-sm">
              <span className="font-medium">Case Modifiers:</span> {getModifiersText()}
            </div>
          </div>

          {/* Intraoperative Planning */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Intraoperative Planning</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Anesthesia</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Airway:</span> {intraop.anticipatedAirway}</div>
                  <div><span className="font-medium">ETT Position:</span> {intraop.ettPosition}</div>
                  <div><span className="font-medium">Protected Limbs:</span> {intraop.protectedLimbs}</div>
                  <div><span className="font-medium">Paralytic OK:</span> {intraop.paralyticOk}</div>
                  <div><span className="font-medium">Pressors OK:</span> {intraop.pressorsOk}</div>
                  <div><span className="font-medium">Antibiotics:</span> {intraop.preopAbx}</div>
                  <div><span className="font-medium">Expected Blood Loss:</span> {intraop.expectedBloodLoss}</div>
                  <div><span className="font-medium">Patient Position:</span> {intraop.patientPosition}</div>
                  <div><span className="font-medium">Table Position:</span> {intraop.tablePosition}</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Nursing & Equipment</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Number of Setups:</span> {intraop.numberOfSetups}</div>
                  <div><span className="font-medium">Saw:</span> {intraop.saw}</div>
                  <div><span className="font-medium">Drill:</span> {intraop.drill}</div>
                  <div><span className="font-medium">H&N Plating:</span> {intraop.hnPlating}</div>
                  <div><span className="font-medium">Extremity Plating:</span> {intraop.extremityPlating}</div>
                  {intraop.platingCompany && (
                    <div><span className="font-medium">Plating Company:</span> {intraop.platingCompany}</div>
                  )}
                  <div><span className="font-medium">STSG:</span> {intraop.stsg}</div>
                  <div><span className="font-medium">Wound Vac:</span> {intraop.woundVac}</div>
                  {intraop.anticipatedTrachSize && (
                    <div><span className="font-medium">Anticipated Trach Size:</span> {intraop.anticipatedTrachSize}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

