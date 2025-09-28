import { useState } from "react"
import { useFormStore } from "./lib/store"
import { generatePlanOfDay, generatePostOpCourse } from "./lib/noteGenerator"
import { PatientStep } from "./components/wizard/PatientStep"
import { AttendingFlapStep } from "./components/wizard/AttendingFlapStep"
import { ModifiersStep } from "./components/wizard/ModifiersStep"
import { IntraopStep } from "./components/wizard/IntraopStep"
import { DischargeStep } from "./components/wizard/DischargeStep"
import { ReviewStep } from "./components/wizard/ReviewStep"
import { OutputDisplay } from "./components/output/OutputDisplay"
import { PlanVisualizer } from "./components/PlanVisualizer"
import { Button } from "./components/ui/button"
import { ChevronLeft, ChevronRight, RotateCcw, FileText, Eye, FormInput } from "lucide-react"
import { toast } from "sonner"
import { Toaster } from "sonner"

const STEPS = [
  { id: 0, title: "Patient", component: PatientStep },
  { id: 1, title: "Attending & Flap", component: AttendingFlapStep },
  { id: 2, title: "Modifiers", component: ModifiersStep },
  { id: 3, title: "Intraop Planning", component: IntraopStep },
  { id: 4, title: "Discharge", component: DischargeStep },
  { id: 5, title: "Review", component: ReviewStep },
]

function App() {
  const {
    currentStep,
    setCurrentStep,
    isGenerating,
    setGenerating,
    generatedNotes,
    setGeneratedNotes,
    reset,
    patient,
    attendingFlap,
    modifiers,
    intraop,
    discharge,
  } = useFormStore()

  const [showOutput, setShowOutput] = useState(false)
  const [activeTab, setActiveTab] = useState<"form" | "visualizer">("form")

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleGenerateNotes = async () => {
    try {
      setGenerating(true)
      
          // Validate all form data
          const formData = {
            patient: patient as any,
            attendingFlap: attendingFlap as any,
            modifiers: modifiers as any,
            intraop: intraop as any,
            discharge: discharge as any,
          }

      // Generate notes
      const planOfDay = generatePlanOfDay(formData)
      const postOpCourse = generatePostOpCourse(formData)

      setGeneratedNotes({
        planOfDay,
        postOpCourse,
      })

      setShowOutput(true)
      toast.success("Notes generated successfully!")
    } catch (error) {
      console.error("Error generating notes:", error)
      toast.error("Error generating notes. Please check your input.")
    } finally {
      setGenerating(false)
    }
  }

  const handleReset = () => {
    reset()
    setShowOutput(false)
    setCurrentStep(0)
    toast.success("Form reset successfully")
  }

  const handleBackToForm = () => {
    setShowOutput(false)
  }

  if (showOutput && generatedNotes) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Free Flap Planner</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleBackToForm}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Form
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
          <OutputDisplay
            planOfDay={generatedNotes.planOfDay}
            postOpCourse={generatedNotes.postOpCourse}
          />
        </div>
        <Toaster />
      </div>
    )
  }

  const CurrentStepComponent = STEPS[currentStep].component

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">Free Flap Planner</h1>
          <p className="text-sm md:text-base text-gray-600">Generate comprehensive surgical planning documents</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 md:mb-8">
          <div className="flex justify-center">
            <div className="flex bg-white rounded-lg p-1 shadow-sm border w-full max-w-md">
              <Button
                variant={activeTab === "form" ? "default" : "ghost"}
                onClick={() => setActiveTab("form")}
                className="flex items-center gap-1 md:gap-2 flex-1 text-xs md:text-sm"
              >
                <FormInput className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Form</span>
                <span className="sm:hidden">Form</span>
              </Button>
              <Button
                variant={activeTab === "visualizer" ? "default" : "ghost"}
                onClick={() => setActiveTab("visualizer")}
                className="flex items-center gap-1 md:gap-2 flex-1 text-xs md:text-sm"
              >
                <Eye className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Plan Visualizer</span>
                <span className="sm:hidden">Visualizer</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "form" ? (
          <>
            {/* Progress Indicator */}
            <div className="mb-6 md:mb-8">
              <div className="flex items-center justify-center space-x-2 md:space-x-4 overflow-x-auto pb-2">
                {STEPS.map((step, index) => (
                  <div key={step.id} className="flex items-center flex-shrink-0">
                    <div
                      className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-medium ${
                        index <= currentStep
                          ? "bg-primary text-primary-foreground"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={`ml-1 md:ml-2 text-xs md:text-sm font-medium hidden sm:block ${
                        index <= currentStep ? "text-primary" : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </span>
                    {index < STEPS.length - 1 && (
                      <div
                        className={`w-4 md:w-8 h-0.5 mx-2 md:mx-4 ${
                          index < currentStep ? "bg-primary" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="mb-6 md:mb-8">
              <CurrentStepComponent />
            </div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" onClick={handleReset} className="flex items-center gap-2 flex-1 sm:flex-none">
                  <RotateCcw className="h-4 w-4" />
                  <span className="hidden sm:inline">Reset</span>
                </Button>
                
                {currentStep === STEPS.length - 1 ? (
                  <Button
                    onClick={handleGenerateNotes}
                    disabled={isGenerating}
                    className="flex items-center gap-2 flex-1 sm:flex-none"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">{isGenerating ? "Generating..." : "Generate Notes"}</span>
                    <span className="sm:hidden">{isGenerating ? "..." : "Generate"}</span>
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="flex items-center gap-2 flex-1 sm:flex-none">
                    <span className="hidden sm:inline">Next</span>
                    <span className="sm:hidden">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Plan Visualizer */
          <div className="mb-8">
            <PlanVisualizer />
          </div>
        )}
      </div>
      <Toaster />
    </div>
  )
}

export default App
