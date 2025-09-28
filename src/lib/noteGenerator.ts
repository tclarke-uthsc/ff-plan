import type { FormData, Attending } from "./types"
import { ATTENDING_PREFERENCES, FLAP_CONFIGS, BASE_PLAN, MODIFIER_OVERRIDES, getAttendingFromSurgeon } from "./config"

function getModifiersText(modifiers: any): string {
  const mods: string[] = []
  if (modifiers.oralCavityAerodigestive) mods.push("Oral cavity/Aerodigestive")
  if (modifiers.laryngectomy) mods.push("Laryngectomy")
  if (modifiers.tracheostomy) mods.push("Tracheostomy")
  if (modifiers.priorRadiation) mods.push("Prior radiation")
  if (modifiers.diabetes) mods.push("Diabetes")
  if (modifiers.traumaRecon) mods.push("Trauma recon")
  if (modifiers.gTube) mods.push("G tube")
  return mods.length > 0 ? mods.join(", ") : "None"
}


function getNpoDuration(modifiers: any): string {
  if (modifiers.priorRadiation) return "14 days (post-XRT)"
  if (modifiers.laryngectomy) return "7 days (laryngectomy)"
  return "5 days (non-irradiated oral cavity)"
}

function getSwallowStudyRequirement(modifiers: any): string {
  if (modifiers.oralCavityAerodigestive && !modifiers.priorRadiation) {
    return "Bedside swallow (non-irradiated)"
  }
  if (modifiers.laryngectomy && !modifiers.priorRadiation) {
    return "Esophagram POD 7 (non-irradiated)"
  }
  return ""
}

function getStapleRemovalText(prefs: any, modifiers: any): string {
  const neckTiming = modifiers.priorRadiation ? prefs.stapleRemoval.neck.radiated : prefs.stapleRemoval.neck.nonIrradiated
  if (prefs.stapleRemoval.leg) {
    return `Neck: ${neckTiming}, Leg: ${prefs.stapleRemoval.leg}, Other: ${prefs.stapleRemoval.other}`
  }
  return `Neck: ${neckTiming}, Other: ${prefs.stapleRemoval.other}`
}

// Helper function to generate plan sections with attending and modifier overrides
function generatePlanSection(sectionKey: keyof typeof BASE_PLAN, attending: Attending, modifiers: any, flapType?: string): string {
  const baseSection = BASE_PLAN[sectionKey]
  const prefs = ATTENDING_PREFERENCES[attending]
  
  // Priority: G tube > Prior radiation > Attending modifier-specific override > Attending base override > Flap-specific modifier > Modifier override > Base plan
  let content: Record<string, string> = {}
  
  // Check for G tube first (highest priority)
  if (modifiers.gTube && prefs.planOverrides.gTube && sectionKey in prefs.planOverrides.gTube) {
    content = { ...(prefs.planOverrides.gTube[sectionKey as keyof typeof prefs.planOverrides.gTube] as Record<string, string>) }
  } else if (modifiers.gTube && MODIFIER_OVERRIDES.gTube && sectionKey in MODIFIER_OVERRIDES.gTube) {
    content = { ...(MODIFIER_OVERRIDES.gTube[sectionKey as keyof typeof MODIFIER_OVERRIDES.gTube] as Record<string, string>) }
  }
  
  // If no G tube override, check for prior radiation (second highest priority)
  if (Object.keys(content).length === 0) {
    if (modifiers.priorRadiation && prefs.planOverrides.priorRadiation && sectionKey in prefs.planOverrides.priorRadiation) {
      content = { ...(prefs.planOverrides.priorRadiation[sectionKey as keyof typeof prefs.planOverrides.priorRadiation] as Record<string, string>) }
    } else if (modifiers.priorRadiation && MODIFIER_OVERRIDES.priorRadiation && sectionKey in MODIFIER_OVERRIDES.priorRadiation) {
      content = { ...(MODIFIER_OVERRIDES.priorRadiation[sectionKey as keyof typeof MODIFIER_OVERRIDES.priorRadiation] as Record<string, string>) }
    }
  }
  
  // If no G tube or prior radiation override, check for attending-specific overrides by other modifiers
  if (Object.keys(content).length === 0) {
    for (const [modifierKey, modifierValue] of Object.entries(modifiers)) {
      if (modifierKey !== 'gTube' && modifierKey !== 'priorRadiation' && modifierValue && prefs.planOverrides[modifierKey as keyof typeof prefs.planOverrides]) {
        const attendingModifierOverride = prefs.planOverrides[modifierKey as keyof typeof prefs.planOverrides]
        if (sectionKey in attendingModifierOverride) {
          content = { ...(attendingModifierOverride[sectionKey as keyof typeof attendingModifierOverride] as Record<string, string>) }
          break // Use first matching attending modifier override
        }
      }
    }
  }
  
  // If no attending modifier override, check attending base override
  if (Object.keys(content).length === 0 && prefs.planOverrides.base && sectionKey in prefs.planOverrides.base) {
    content = { ...(prefs.planOverrides.base[sectionKey as keyof typeof prefs.planOverrides.base] as Record<string, string>) }
  }
  
  // If no attending overrides, check flap-specific modifiers
  if (Object.keys(content).length === 0 && flapType && MODIFIER_OVERRIDES[flapType.toLowerCase() as keyof typeof MODIFIER_OVERRIDES]) {
    const flapModifier = MODIFIER_OVERRIDES[flapType.toLowerCase() as keyof typeof MODIFIER_OVERRIDES]
    if (sectionKey in flapModifier) {
      content = { ...(flapModifier[sectionKey as keyof typeof flapModifier] as Record<string, string>) }
    }
  }
  
  // If no flap-specific override, check modifier-specific overrides (excluding G tube and prior radiation)
  if (Object.keys(content).length === 0) {
    for (const [modifierKey, modifierValue] of Object.entries(modifiers)) {
      if (modifierKey !== 'gTube' && modifierKey !== 'priorRadiation' && modifierValue && MODIFIER_OVERRIDES[modifierKey as keyof typeof MODIFIER_OVERRIDES]) {
        const modifierOverride = MODIFIER_OVERRIDES[modifierKey as keyof typeof MODIFIER_OVERRIDES]
        if (sectionKey in modifierOverride) {
          content = { ...(modifierOverride[sectionKey as keyof typeof modifierOverride] as Record<string, string>) }
          break // Use first matching modifier override
        }
      }
    }
  }
  
  // If no overrides found, use base plan
  if (Object.keys(content).length === 0) {
    content = { ...baseSection.content }
  }
  
  // Process template variables and convert to array
  const contentArray = Object.values(content).map((item: string) => {
    let processedItem = item
      .replace('{aspirinDuration}', prefs.aspirinDuration)
      .replace('{laryngectomyConsults}', modifiers.laryngectomy ? ", SLP for laryngectomy counseling/electrolarynx teaching" : "")
    return processedItem
  })
  
  return `<h3>${baseSection.title}</h3>
<ul>
${contentArray.map((item: string) => `<li>${item}</li>`).join('\n')}
</ul>`
}

// Note generation functions
export function generatePlanOfDay(data: FormData): string {
  const { patient, attendingFlap, intraop } = data

  const attendingKey = getAttendingFromSurgeon(attendingFlap.reconstructiveSurgeon)
  const attendingPrefs = ATTENDING_PREFERENCES[attendingKey]
  const flap = attendingFlap.flap
  
  // Determine wound vac preference based on attending and flap type
  let woundVacNote = intraop.woundVac
  if (attendingPrefs.woundVacPreferences) {
    if (flap === "RFFF" && attendingPrefs.woundVacPreferences.rfff) {
      woundVacNote = `${intraop.woundVac} (${attendingPrefs.woundVacPreferences.rfff})`
    } else if (flap === "Fibula" && attendingPrefs.woundVacPreferences.fibula) {
      woundVacNote = `${intraop.woundVac} (${attendingPrefs.woundVacPreferences.fibula})`
    }
  }

  return `<h1>FREE FLAP PLAN OF THE DAY</h1>

<p><strong>Patient:</strong> ${patient.name}</p>
<p><strong>Date:</strong> ${patient.date}</p>
<p><strong>MRN:</strong> ${patient.mrn}</p>

<h2>History (one line):</h2>
<p>${patient.diagnosis}</p>

<h2>Planned Procedures:</h2>
<p>${Array.isArray(patient.plannedProcedures) ? patient.plannedProcedures.join(", ") : patient.plannedProcedures}</p>

<h2>Anesthesia</h2>
<ul>
<li><strong>Recommended airway:</strong> ${intraop.anticipatedAirway}</li>
<li><strong>ETT Positioning:</strong> ${intraop.ettPosition}</li>
<li><strong>Protected limbs:</strong> ${intraop.protectedLimbs}</li>
<li><strong>Paralytic ok:</strong> ${intraop.paralyticOk}</li>
<li><strong>Pressors ok:</strong> ${intraop.pressorsOk}</li>
<li><strong>Antibiotics:</strong> ${intraop.preopAbx}</li>
<li><strong>Expected bloodloss:</strong> ${intraop.expectedBloodLoss}</li>
<li><strong>Predicted postoperative airway:</strong> ${intraop.anticipatedAirway}</li>
<li><strong>Patient Position:</strong> ${intraop.patientPosition}</li>
<li><strong>Table Position:</strong> ${intraop.tablePosition}</li>
</ul>

<h2>Nursing:</h2>
<ul>
<li><strong>Underbody warmer:</strong> Yes</li>
<li><strong>Number of setups:</strong> ${intraop.numberOfSetups}</li>
<li><strong>Saw:</strong> ${intraop.saw}</li>
<li><strong>Drill:</strong> ${intraop.drill}</li>
<li><strong>H&N plating:</strong> ${intraop.hnPlating}</li>
<li><strong>Extremity plating:</strong> ${intraop.extremityPlating}</li>
<li><strong>Plating company:</strong> ${intraop.platingCompany || "***"}</li>
<li><strong>Split thickness skin graft:</strong> ${intraop.stsg}</li>
<li><strong>Anticipated trach size:</strong> ${intraop.anticipatedTrachSize || "***"}</li>
<li><strong>Wound vac:</strong> ${woundVacNote}</li>
</ul>

<h2>Other Notes:</h2>
<p>***</p>
`
}

export function generatePostOpCourse(data: FormData): string {
  const { attendingFlap, modifiers } = data
  const attending = getAttendingFromSurgeon(attendingFlap.reconstructiveSurgeon!)
  const flap = attendingFlap.flap!
  const prefs = ATTENDING_PREFERENCES[attending]
  const flapConfig = FLAP_CONFIGS[flap]
  
  // Generate plan sections similar to Plan Visualizer
  let planSections = ""
  
  Object.entries(BASE_PLAN).forEach(([sectionKey, section]) => {
    const content = generatePlanSection(sectionKey as keyof typeof BASE_PLAN, attending, modifiers, flap)
    const hasOverrides = getOverrideSource(sectionKey as keyof typeof BASE_PLAN, attending, modifiers, flap).type !== "base"
    
    planSections += `
<div style="margin-bottom: 1rem; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; ${hasOverrides ? 'background-color: #eff6ff; border-color: #93c5fd;' : 'background-color: #f9fafb;'}">
  <h3 style="margin: 0 0 0.5rem 0; font-size: 1.125rem; font-weight: 600; color: #111827;">${section.title}</h3>
  ${content.replace('<h3>', '').replace('</h3>', '')}
</div>`
  })
  
  // Add Flap-Specific Care section
  const flapSpecificCare = `
<div style="margin-bottom: 1rem; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; background-color: #f0fdf4; border-color: #86efac;">
  <h3 style="margin: 0 0 0.5rem 0; font-size: 1.125rem; font-weight: 600; color: #111827;">Flap-Specific Care</h3>
  <ul style="margin: 0; padding-left: 1.5rem;">
    <li><strong>Extremity Care:</strong> ${prefs.flapPreferences[flap]?.extremityCare || flapConfig.extremityCare}</li>
    <li><strong>DME:</strong> ${flapConfig.dme}</li>
    <li><strong>Wound Care:</strong> ${prefs.flapPreferences[flap]?.woundCare || "Standard wound care"}</li>
  </ul>
</div>`
  
  return `<h1>ANTICIPATED POST-OPERATIVE COURSE</h1>

<div style="margin-bottom: 1.5rem; padding: 1rem; background-color: #f3f4f6; border-radius: 0.5rem;">
  <h2 style="margin: 0 0 0.5rem 0; font-size: 1.25rem; font-weight: 600;">Case Overview</h2>
  <ul style="margin: 0; padding-left: 1.5rem;">
    <li><strong>Reconstructive Surgeon:</strong> ${attendingFlap.reconstructiveSurgeon}</li>
    <li><strong>Flap Type:</strong> ${flap}</li>
    <li><strong>Modifiers:</strong> ${getModifiersText(modifiers)}</li>
  </ul>
</div>

${flapSpecificCare}

${planSections}
`
}

// Helper function to get override source (similar to Plan Visualizer)
function getOverrideSource(sectionKey: keyof typeof BASE_PLAN, attending: Attending, modifiers: any, flap?: string) {
  const prefs = ATTENDING_PREFERENCES[attending]
  
  // Check for G tube first (highest priority)
  if (modifiers.gTube && prefs.planOverrides.gTube && sectionKey in prefs.planOverrides.gTube) {
    return { type: "attending", name: `${attending} (gTube)` }
  } else if (modifiers.gTube && MODIFIER_OVERRIDES.gTube && sectionKey in MODIFIER_OVERRIDES.gTube) {
    return { type: "modifier", name: "gTube" }
  }
  
  // Check for prior radiation (second highest priority)
  if (modifiers.priorRadiation && prefs.planOverrides.priorRadiation && sectionKey in prefs.planOverrides.priorRadiation) {
    return { type: "attending", name: `${attending} (priorRadiation)` }
  } else if (modifiers.priorRadiation && MODIFIER_OVERRIDES.priorRadiation && sectionKey in MODIFIER_OVERRIDES.priorRadiation) {
    return { type: "modifier", name: "priorRadiation" }
  }
  
  // Check for attending-specific overrides by other modifiers
  for (const [modifierKey, modifierValue] of Object.entries(modifiers)) {
    if (modifierKey !== 'gTube' && modifierKey !== 'priorRadiation' && modifierValue && prefs.planOverrides[modifierKey as keyof typeof prefs.planOverrides]) {
      const attendingModifierOverride = prefs.planOverrides[modifierKey as keyof typeof prefs.planOverrides]
      if (sectionKey in attendingModifierOverride) {
        return { type: "attending", name: `${attending} (${modifierKey})` }
      }
    }
  }
  
  // Check for attending base override
  if (prefs.planOverrides.base && sectionKey in prefs.planOverrides.base) {
    return { type: "attending", name: `${attending} (base)` }
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


// Main note generation function
export function generateNotes(data: FormData): { planOfDay: string; postOpCourse: string } {
  return {
    planOfDay: generatePlanOfDay(data),
    postOpCourse: generatePostOpCourse(data)
  }
}
