import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { BASE_PLAN, ATTENDING_PREFERENCES, MODIFIER_OVERRIDES, SURGEON_OPTIONS, FLAP_OPTIONS, FLAP_CONFIGS } from "../lib/config"
import { getAttendingFromSurgeon } from "../lib/config"
import { Eye, EyeOff, ArrowRight, Info } from "lucide-react"

export function PlanVisualizer() {
  const [selectedAttending, setSelectedAttending] = useState<string>("Dr. Gleysteen")
  const [selectedFlap, setSelectedFlap] = useState<string>("ALT")
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, boolean>>({
    oralCavityAerodigestive: false,
    laryngectomy: false,
    priorRadiation: false,
    diabetes: false,
    tracheostomy: false,
    traumaRecon: false,
    gTube: false
  })
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [showOnlyOverrides, setShowOnlyOverrides] = useState(false)

  const attending = selectedAttending
  const flap = selectedFlap
  const modifiers = selectedModifiers
  const attendingKey = getAttendingFromSurgeon(attending)
  const flapConfig = FLAP_CONFIGS[flap as keyof typeof FLAP_CONFIGS]

  const toggleSection = (sectionKey: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionKey)) {
      newExpanded.delete(sectionKey)
    } else {
      newExpanded.add(sectionKey)
    }
    setExpandedSections(newExpanded)
  }

  const getPlanContent = (sectionKey: keyof typeof BASE_PLAN) => {
    const baseSection = BASE_PLAN[sectionKey]
    const prefs = ATTENDING_PREFERENCES[attendingKey]
    
    // Priority: G tube > Prior radiation > Attending modifier-specific override > Attending base override > Modifier override > Base plan
    
    // Check for G tube first (highest priority)
    if (modifiers.gTube && prefs.planOverrides.gTube && sectionKey in prefs.planOverrides.gTube) {
      return prefs.planOverrides.gTube[sectionKey as keyof typeof prefs.planOverrides.gTube]
    } else if (modifiers.gTube && MODIFIER_OVERRIDES.gTube && sectionKey in MODIFIER_OVERRIDES.gTube) {
      return MODIFIER_OVERRIDES.gTube[sectionKey as keyof typeof MODIFIER_OVERRIDES.gTube]
    }
    
    // Check for prior radiation (second highest priority)
    if (modifiers.priorRadiation && prefs.planOverrides.priorRadiation && sectionKey in prefs.planOverrides.priorRadiation) {
      return prefs.planOverrides.priorRadiation[sectionKey as keyof typeof prefs.planOverrides.priorRadiation]
    } else if (modifiers.priorRadiation && MODIFIER_OVERRIDES.priorRadiation && sectionKey in MODIFIER_OVERRIDES.priorRadiation) {
      return MODIFIER_OVERRIDES.priorRadiation[sectionKey as keyof typeof MODIFIER_OVERRIDES.priorRadiation]
    }
    
    // Check for attending-specific overrides by other modifiers
    for (const [modifierKey, modifierValue] of Object.entries(modifiers)) {
      if (modifierKey !== 'gTube' && modifierKey !== 'priorRadiation' && modifierValue && prefs.planOverrides[modifierKey as keyof typeof prefs.planOverrides]) {
        const attendingModifierOverride = prefs.planOverrides[modifierKey as keyof typeof prefs.planOverrides]
        if (sectionKey in attendingModifierOverride) {
          return attendingModifierOverride[sectionKey as keyof typeof attendingModifierOverride]
        }
      }
    }
    
    // If no attending modifier override, check attending base override
    if (prefs.planOverrides.base && sectionKey in prefs.planOverrides.base) {
      return prefs.planOverrides.base[sectionKey as keyof typeof prefs.planOverrides.base]
    }
    
    // If no attending overrides, check modifier-specific overrides (excluding G tube and prior radiation)
    for (const [modifierKey, modifierValue] of Object.entries(modifiers)) {
      if (modifierKey !== 'gTube' && modifierKey !== 'priorRadiation' && modifierValue && MODIFIER_OVERRIDES[modifierKey as keyof typeof MODIFIER_OVERRIDES]) {
        const modifierOverride = MODIFIER_OVERRIDES[modifierKey as keyof typeof MODIFIER_OVERRIDES]
        if (sectionKey in modifierOverride) {
          return modifierOverride[sectionKey as keyof typeof modifierOverride]
        }
      }
    }
    
    // Return base plan if no overrides
    return baseSection.content
  }

  const getOverrideSource = (sectionKey: keyof typeof BASE_PLAN) => {
    const prefs = ATTENDING_PREFERENCES[attendingKey]
    
    // Check for G tube first (highest priority)
    if (modifiers.gTube && prefs.planOverrides.gTube && sectionKey in prefs.planOverrides.gTube) {
      return { type: "attending", name: `${attendingKey} (gTube)` }
    } else if (modifiers.gTube && MODIFIER_OVERRIDES.gTube && sectionKey in MODIFIER_OVERRIDES.gTube) {
      return { type: "modifier", name: "gTube" }
    }
    
    // Check for prior radiation (second highest priority)
    if (modifiers.priorRadiation && prefs.planOverrides.priorRadiation && sectionKey in prefs.planOverrides.priorRadiation) {
      return { type: "attending", name: `${attendingKey} (priorRadiation)` }
    } else if (modifiers.priorRadiation && MODIFIER_OVERRIDES.priorRadiation && sectionKey in MODIFIER_OVERRIDES.priorRadiation) {
      return { type: "modifier", name: "priorRadiation" }
    }
    
    // Check for attending-specific overrides by other modifiers
    for (const [modifierKey, modifierValue] of Object.entries(modifiers)) {
      if (modifierKey !== 'gTube' && modifierKey !== 'priorRadiation' && modifierValue && prefs.planOverrides[modifierKey as keyof typeof prefs.planOverrides]) {
        const attendingModifierOverride = prefs.planOverrides[modifierKey as keyof typeof prefs.planOverrides]
        if (sectionKey in attendingModifierOverride) {
          return { type: "attending", name: `${attendingKey} (${modifierKey})` }
        }
      }
    }
    
    // Check for attending base override
    if (prefs.planOverrides.base && sectionKey in prefs.planOverrides.base) {
      return { type: "attending", name: `${attendingKey} (base)` }
    }
    
    // Check for modifier-specific overrides (excluding G tube and prior radiation)
    for (const [modifierKey, modifierValue] of Object.entries(modifiers)) {
      if (modifierKey !== 'gTube' && modifierKey !== 'priorRadiation' && modifierValue && MODIFIER_OVERRIDES[modifierKey as keyof typeof MODIFIER_OVERRIDES]) {
        const modifierOverride = MODIFIER_OVERRIDES[modifierKey as keyof typeof MODIFIER_OVERRIDES]
        if (sectionKey in modifierOverride) {
          return { type: "modifier", name: modifierKey }
        }
      }
    }
    
    return { type: "base", name: "Base Plan" }
  }

  const hasOverrides = (sectionKey: keyof typeof BASE_PLAN) => {
    const source = getOverrideSource(sectionKey)
    return source.type !== "base"
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Attending Preference Playground</h2>
        <p className="text-gray-600">Verify your preferences and see how they modify the base plan</p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Test Your Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Your Name</label>
              <div className="flex gap-2 flex-wrap">
                {SURGEON_OPTIONS.map((surgeon) => (
                  <Button
                    key={surgeon}
                    variant={selectedAttending === surgeon ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedAttending(surgeon)}
                  >
                    {surgeon}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Select Flap Type</label>
              <div className="flex gap-2 flex-wrap">
                {FLAP_OPTIONS.map((flapType) => (
                  <Button
                    key={flapType}
                    variant={selectedFlap === flapType ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFlap(flapType)}
                  >
                    {flapType}
                  </Button>
                ))}
              </div>
            </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Add Patient Modifiers</label>
            <p className="text-xs text-gray-500 mb-2">Toggle modifiers to see how they affect your plan</p>
            <div className="flex gap-2 flex-wrap">
              {Object.keys(selectedModifiers).map((modifier) => (
                <Button
                  key={modifier}
                  variant={selectedModifiers[modifier] ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedModifiers(prev => ({
                    ...prev,
                    [modifier]: !prev[modifier]
                  }))}
                >
                  {modifier.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t">
            <input
              type="checkbox"
              id="showOnlyOverrides"
              checked={showOnlyOverrides}
              onChange={(e) => setShowOnlyOverrides(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="showOnlyOverrides" className="text-sm font-medium">
              Show only sections with overrides
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Current Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Current Test Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex gap-4 flex-wrap">
              <Badge variant="secondary" className="text-sm">
                Attending: {attending}
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Flap: {flap}
              </Badge>
              {Object.entries(modifiers)
                .filter(([_, value]) => value)
                .map(([key, _]) => (
                  <Badge key={key} variant="outline" className="text-sm">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Badge>
                ))}
            </div>
            {Object.entries(modifiers).filter(([_, value]) => value).length === 0 && (
              <p className="text-sm text-gray-500">No modifiers selected - showing base plan with attending preferences only</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plan Sections */}
      <div className="space-y-4">
        {Object.entries(BASE_PLAN)
          .filter(([sectionKey, _]) => {
            if (!showOnlyOverrides) return true
            return hasOverrides(sectionKey as keyof typeof BASE_PLAN)
          })
          .map(([sectionKey, section]) => {
            const content = getPlanContent(sectionKey as keyof typeof BASE_PLAN)
            const overrideSource = getOverrideSource(sectionKey as keyof typeof BASE_PLAN)
            const isExpanded = expandedSections.has(sectionKey)
            const hasOverride = hasOverrides(sectionKey as keyof typeof BASE_PLAN)

            return (
              <Card key={sectionKey} className={hasOverride ? "border-blue-200 bg-blue-50" : ""}>
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => toggleSection(sectionKey)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      {hasOverride && (
                        <Badge variant="secondary" className="text-xs">
                          {overrideSource.type === "attending" ? "Your Override" : "Modifier Override"}
                        </Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      {isExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {hasOverride && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Source:</span>
                      <Badge variant="outline" className="text-xs">
                        {overrideSource.type === "attending" ? `Your preferences (${overrideSource.name})` : overrideSource.name}
                      </Badge>
                    </div>
                  )}
                </CardHeader>
                
                {isExpanded && (
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(content).map(([key, value]) => (
                        <div key={key} className="flex items-start gap-2 p-2 bg-white rounded border">
                          <Badge variant="outline" className="text-xs shrink-0">
                            {key}
                          </Badge>
                          <ArrowRight className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                          <span className="text-sm">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        
        {showOnlyOverrides && Object.entries(BASE_PLAN).every(([sectionKey, _]) => !hasOverrides(sectionKey as keyof typeof BASE_PLAN)) && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No overrides found for current configuration</p>
              <p className="text-sm text-gray-400 mt-1">Try adding modifiers or selecting a different attending</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Flap-Specific Information */}
      <Card>
        <CardHeader>
          <CardTitle>Flap-Specific Care</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-start gap-2 p-2 bg-white rounded border">
              <Badge variant="outline" className="text-xs shrink-0">
                Extremity Care
              </Badge>
              <ArrowRight className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
              <span className="text-sm">{ATTENDING_PREFERENCES[attendingKey].flapPreferences[flap as keyof typeof ATTENDING_PREFERENCES[typeof attendingKey]['flapPreferences']]?.extremityCare || flapConfig.extremityCare}</span>
            </div>
            <div className="flex items-start gap-2 p-2 bg-white rounded border">
              <Badge variant="outline" className="text-xs shrink-0">
                DME
              </Badge>
              <ArrowRight className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
              <span className="text-sm">{flapConfig.dme}</span>
            </div>
            <div className="flex items-start gap-2 p-2 bg-white rounded border">
              <Badge variant="outline" className="text-xs shrink-0">
                Wound Care
              </Badge>
              <ArrowRight className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
              <span className="text-sm">{ATTENDING_PREFERENCES[attendingKey].flapPreferences[flap as keyof typeof ATTENDING_PREFERENCES[typeof attendingKey]['flapPreferences']]?.woundCare || "Standard wound care"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use This Playground</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">1. Select Your Name</h4>
              <p className="text-gray-600">Choose your name to see your specific preferences applied to the base plan.</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">2. Select Flap Type</h4>
              <p className="text-gray-600">Choose the flap type to see flap-specific care instructions (extremity care, DME requirements).</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">3. Add Patient Modifiers</h4>
              <p className="text-gray-600">Toggle modifiers to see how they change your plan (e.g., laryngectomy, prior radiation).</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">4. Verify Your Preferences</h4>
              <p className="text-gray-600">Look for sections marked with "Your Override" to confirm your preferences are correctly configured.</p>
            </div>
            
            <div className="space-y-2 pt-2 border-t">
              <h4 className="font-medium">Visual Indicators:</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-gray-300 bg-white rounded"></div>
                  <span>Base plan (no changes)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-blue-200 bg-blue-50 rounded"></div>
                  <span>Modified by you or patient modifiers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">Your Override</Badge>
                  <span>Your specific preferences</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">Modifier Override</Badge>
                  <span>Changed by patient modifiers</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
