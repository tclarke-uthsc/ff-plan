import type { Attending } from "./types"

// Base plan - common features across all attendings
export const BASE_PLAN = {
  flapManagement: {
    title: "Flap Management",
    content: {
      flapChecks: "Flap checks q1h while in ICU, AM and PM needle prick checks",
      doppler: "Continue internal doppler, will remove on POD5",
      positioning: "HOB elevated to 30 degrees, head in neutral position",
      woundCare: "Local wound care: bacitracin BID"
    }
  },
  importantRestrictions: {
    title: "Important Restrictions",
    content: {
      neckPressure: "No pressure to neck or circumferential ties until POD 6 or upon discharge if sooner",
      faceTies: "No circumferential ties around the face",
      restrictions: "No nicotine/pressors/diuretics/energy drinks for entire stay"
    }
  },
  neuroPainManagement: {
    title: "Neuro/Pain Management",
    content: {
      multimodal: "Scheduled Tylenol q6hr, NSAID, Tramadol q6hr, Gabapentin 200mg TID",
      breakthrough: "Oxycodone q6hr, IV morphine prn"
    }
  },
  cardiovascular: {
    title: "Cardiovascular",
    content: {
      aline: "Continue A-line, remove on POD1",
      monitoring: "Monitor HR/BP",
      bpManagement: "Goal SBP > 100; no anti-HTN meds unless SBP >180 for entire stay",
      homeMeds: "Home hypertension medications held, restart home beta blocker on POD1 ***"
    }
  },
  respiratory: {
    title: "Respiratory",
    content: {
      monitoring: "Monitor respiratory status",
      oxygen: "Oxygen as needed"
    }
  },
  gastrointestinal: {
    title: "Gastrointestinal",
    content: {
      diet: "Regular diet as tolerated",
      bowelRegimen: "Bowel regimen: miralax, docusate",
      ulcerProphylaxis: "PPI prophylaxis"
    }
  },
  renalGu: {
    title: "Renal/GU",
    content: {
      foley: "Foley catheter in plac, remove on POD1, void check in 6-8h",
      monitoring: "Monitor I/Os",
      electrolytes: "Order CBC, BMP, Mag, and Phos for AM",
      ivf: "Crystalloid to run at maintenance fluids"
    }
  },
  infectiousDisease: {
    title: "Infectious Disease",
    content: {
      antibiotics: "Ancef x 24 hours",
      cbc: "Daily CBC till POD3"
    }
  },
  endocrine: {
    title: "Endocrine",
    content: {
      steroids: "IV dexamethasone 8mg q8h x24h post-op",
      glucose: "Accuchecks q6h"
    }
  },
  hematology: {
    title: "Hematology",
    content: {
      hgb: "Transfuse for Hb < 7, Hb <8 for cardiac patients, or if patient is symptomatic or has signs of hypovolemia",
      aspirin: "Start ASA 81mg PO daily",
      scds: "SCDs",
      lovenox: "Enoxaparin 40 for DVT prophylaxis, 30 for patients with CrCl< 30"
    }
  },
  woundCare: {
    title: "Wound Care",
    content: {
      bacitracin: "Bacitracin BID x 3 days",
      drains: "Bulb suction (if not holding put to low continuous wall suction)",
      crusts: "Remove crusts from incision lines with hydrogen peroxide during duration of hospital stay"
    }
  },
  additionalOrders: {
    title: "Additional Orders",
    content: {
      consults: "Consults: ICU, CM"
    }
  }
} as const

// Attending-specific preferences and overrides
export const ATTENDING_PREFERENCES = {
  Gleysteen: {
    // Post-op course preferences
    aspirinDuration: "1 week",
    dopplerManagement: "Pull implantable doppler on POD 5",
    stsgManagement: "Remove wound VAC POD 5, Xeroform + Kerlix (change daily)",
    stapleRemoval: {
      neck: { nonIrradiated: "POD 7", radiated: "POD 10-14 (clinic)" },
      leg: "POD 7-8",
      other: "POD 10"
    },
    dischargeWoundCare: "Xeroform daily until scabbing (POD 10)",
    woundVacPreferences: {
      rfff: "Uses wound vac for RFFF",
      fibula: "Uses wound vac for fibula"
    },
    // Flap-specific preferences
    flapPreferences: {
      Fibula: {
        woundCare: "Remove wound VAC POD 5, Xeroform + Kerlix (change daily)",
        extremityCare: "Leg boot x5 days, remove on POD 5"
      },
      RFFF: {
        woundCare: "Remove wound VAC POD 5, Xeroform + Kerlix (change daily)",
        extremityCare: "Remove forearm brace/wound vac on POD 5, replace with xeroform and Kerlix and leave on until follow up"
      },
      Scapula: {
        woundCare: "Standard wound care",
        extremityCare: "Wear for 3 days, then can mobilize shoulder with PT"
      },
      Jejunal: {
        woundCare: "Standard wound care",
        extremityCare: "Abdominal binder x5 days"
      },
      ALT: {
        woundCare: "Standard wound care",
        extremityCare: "Standard care"
      },
      LatissimusDorsi: {
        woundCare: "Standard wound care",
        extremityCare: "Trunk binder x3 days"
      },
      Other: {
        woundCare: "Standard wound care",
        extremityCare: "Standard care"
      }
    },
    // Plan overrides by modifier - only specify what's different from base plan
    planOverrides: {
      base: {
        // Gleysteen uses base plan for most sections
      },
      laryngectomy: {
        // Laryngectomy-specific preferences
      },
      oralCavityAerodigestive: {
        // Oral cavity-specific preferences
      },
      priorRadiation: {
        // Prior radiation-specific preferences
      },
      diabetes: {
        // Diabetes-specific preferences
      },
      tracheostomy: {
        // Tracheostomy-specific preferences
      },
      traumaRecon: {
        // Trauma recon-specific preferences
      },
      gTube: {
        // G tube-specific preferences
      }
    }
  },
  Eid: {
    // Post-op course preferences
    aspirinDuration: "3 weeks",
    dopplerManagement: "Cut doppler wire and tape to skin",
    stsgManagement: "Wound VAC until clinic POD 10, Xeroform bolster (change outer Kerlix only)",
    stapleRemoval: {
      neck: { nonIrradiated: "discharge AM", radiated: "POD 10-14 (clinic)" },
      other: "POD 10-14 (clinic)"
    },
    dischargeWoundCare: "Tegaderm dressing, remove in shower POD 10",
    restrictions: "Okay for chocolate, tea and decaf coffee",
    woundVacPreferences: {
      rfff: "No wound vac for RFFF",
      fibula: "Uses wound vac for fibula"
    },
    // Flap-specific preferences
    flapPreferences: {
      Fibula: {
        woundCare: "Wound VAC until clinic POD 10, Xeroform bolster (change outer Kerlix only)",
        extremityCare: "Q1hr foot neurocheck x24-48hrs"
      },
      RFFF: {
        woundCare: "No wound VAC for RFFF",
        extremityCare: "Remove plaster/splint on POD 5, replace with soft splint, keep bolster until POD 10-14"
      },
      Scapula: {
        woundCare: "Standard wound care",
        extremityCare: "A Velcro shoulder immobilizer can be placed on the patient in the operating room. Begin shoulder physical therapy on postoperative day 5"
      },
      Jejunal: {
        woundCare: "Standard wound care",
        extremityCare: "Abdominal binder x5 days"
      },
      ALT: {
        woundCare: "Standard wound care",
        extremityCare: "Standard care"
      },
      LatissimusDorsi: {
        woundCare: "Standard wound care",
        extremityCare: "Trunk binder x3 days"
      },
      Other: {
        woundCare: "Standard wound care",
        extremityCare: "Standard care"
      }
    },
    // Plan overrides by modifier - only specify what's different from base plan
    planOverrides: {
      base: {
        // Eid uses base plan for most sections
      },
      laryngectomy: {
        // Laryngectomy-specific preferences
      },
      oralCavityAerodigestive: {
        neuroPainManagement: {
          multimodal: "Multimodal regimen with scheduled Tylenol, celecoxib, tramadol",
          breakthrough: "PRN oxycodone for breakthrough pain",
        },
        gastrointestinal: {
          ngPlacement: "Abdominal Xray for NG placement - pending*** (Eid: Use two view prior to feeding while in the hospital)",
          npo: "NPO with maintenance IVF",
          tubeFeeding: "Start continuous TF (impact peptide 1.5) in AM; titrate to goal; appreciate nutrition recs",
          bowelRegimen: "Bowel regimen: miralax, docusate",
          ulcerProphylaxis: "GI ulcer prophylaxis: PPI while in ICU"
        }
      },
      priorRadiation: {
        // Prior radiation-specific preferences
      },
      diabetes: {
        // Diabetes-specific preferences
      },
      tracheostomy: {
        // Tracheostomy-specific preferences
      },
      traumaRecon: {
        multimodal: "Multimodal regimen with scheduled Tylenol, celecoxib, tramadol",
        breakthrough: "PRN oxycodone for breakthrough pain",
        traumaRecon: "Trauma recon: Tylenol, NSAID, Oxycodone or Tramadol – no Gabapentin"
      },
      gTube: {
        // G tube-specific preferences
      }
    }
  },
  Wood: {
    // Post-op course preferences
    aspirinDuration: "1 week",
    dopplerManagement: "Cut doppler wire and tape to skin",
    stsgManagement: "Remove wound VAC POD 5, Xeroform + Kerlix (do not change daily)",
    stapleRemoval: {
      neck: { nonIrradiated: "POD 7", radiated: "POD 10-14 (clinic)" },
      leg: "POD 7-8",
      other: "POD 10"
    },
    dischargeWoundCare: "Leave open to scab and heal (POD 4)",
    woundVacPreferences: {
      rfff: "Uses wound vac for RFFF",
      fibula: "Uses wound vac for fibula"
    },
    // Flap-specific preferences
    flapPreferences: {
      Fibula: {
        woundCare: "Remove wound VAC POD 5, Xeroform + Kerlix (do not change daily)",
        extremityCare: "Leg boot x5 days, remove on POD 5"
      },
      RFFF: {
        woundCare: "Remove wound VAC POD 5, Xeroform + Kerlix (do not change daily)",
        extremityCare: "Remove forearm splint on POD 5, replace with xeroform and Kerlix and leave on until follow up"
      },
      Scapula: {
        woundCare: "Standard wound care",
        extremityCare: "No immobilizer, can start physical therapy on POD 1"
      },
      Jejunal: {
        woundCare: "Standard wound care",
        extremityCare: "Abdominal binder x5 days"
      },
      ALT: {
        woundCare: "Standard wound care",
        extremityCare: "Standard care"
      },
      LatissimusDorsi: {
        woundCare: "Standard wound care",
        extremityCare: "Trunk binder x3 days"
      },
      Other: {
        woundCare: "Standard wound care",
        extremityCare: "Standard care"
      }
    },
    // Plan overrides by modifier - only specify what's different from base plan
    planOverrides: {
      base: {
        // Wood uses base plan for most sections
      },
      laryngectomy: {
        // Laryngectomy-specific preferences
      },
      oralCavityAerodigestive: {
        // Oral cavity-specific preferences
      },
      priorRadiation: {
        // Prior radiation-specific preferences
      },
      diabetes: {
        // Diabetes-specific preferences
      },
      tracheostomy: {
        // Tracheostomy-specific preferences
      },
      traumaRecon: {
        // Trauma recon-specific preferences
      },
      gTube: {
        // G tube-specific preferences
      }
    }
  }
} as const

// Modifier-specific plan overrides
export const MODIFIER_OVERRIDES = {
  laryngectomy: {
    gastrointestinal: {
      npo: "NPO (7 days for laryngectomy)",
      ngPlacement: "Check Abd XRAY post op to confirm Dobhoff tube placement",
      tubeFeeding: "Start continuous TF (impact peptide 1.5) in AM; titrate to goal; appreciate nutrition recs",
      nutrition: "Consult nutrition for enteral feeding recommendations- use ERAS nutrition protocol",
      bowelRegimen: "Bowel regimen: miralax, docusate",
      ulcerProphylaxis: "PPI prophylaxis"
    },
    respiratory: {
      humidified: "Humidified TC, wean to 28% FiO2",
      suction: "Suction PRN and q2h",
    },
    infectiousDisease: {
      antibiotics: "Unasyn, if not available Ancef + Flagyl x 24 hours",
    },
    additionalOrders: {
      consults: "Consults: ICU, PT/OT, Nutrition, CM for home supplies and discharge planning, SLP for laryngectomy counseling/electrolarynx teaching"
    }
  },
  priorRadiation: {
    gastrointestinal: {
      npo: "NPO (14 days for post-XRT recon flaps)",
      ngPlacement: "Check Abd XRAY post op to confirm Dobhoff tube placement",
      tubeFeeding: "Start continuous TF (impact peptide 1.5) in AM; titrate to goal; appreciate nutrition recs",
      nutrition: "Consult nutrition for enteral feeding recommendations- use ERAS nutrition protocol",
      bowelRegimen: "Bowel regimen: miralax, docusate",
      ulcerProphylaxis: "PPI prophylaxis"
    }
  },
  diabetes: {
    endocrine: {
      steroids: "IV dexamethasone 8mg q8h x24h post-op",
      glucose: "Accuchecks q6h",
      glycemic: "SSI with tight glycemic control",
      diabetesMonitoring: "Monitor blood glucose closely due to diabetes"
    }
  },
  oralCavityAerodigestive: {
    gastrointestinal: {
      npo: "NPO (at least five days for non-irradiated upper pharyngeal/oral cavity recon flaps)",
      ngPlacement: "Check Abd XRAY post op to confirm Dobhoff tube placement",
      tubeFeeding: "Start continuous TF (impact peptide 1.5) in AM; titrate to goal; appreciate nutrition recs",
      nutrition: "Consult nutrition for enteral feeding recommendations- use ERAS nutrition protocol",
      bowelRegimen: "Bowel regimen: miralax, docusate",
      ulcerProphylaxis: "PPI prophylaxis"
    },
    woundCare: {
      bacitracin: "Bacitracin to incisions BID",
      drains: "Continue JP drains",
      peridex: "Peridex TID (for oral cavity reconstruction)"
    }
  },
  tracheostomy: {
    respiratory: {
      trach: "Trach in place with cuff inflated overnight",
      humidified: "Humidified TC, wean to 28% FiO2.",
      obturator: "Keep obturator at head of bed",
      trachSizes: "Keep same size trach and once size smaller at bedside",
      suction: "Suction PRN and q2h",
      ties: "No circumferential ties around the neck (no trach ties or O2 elastic green ties). Use two washcloths, one on each shoulder to hold trach collar"
    },
    additionalOrders: {
      homeMeds: "Home medications: Restarted",
      consults: "Consults: ICU, PT/OT, Nutrition, CM for home supplies and discharge planning, SLP for tracheostomy care"
    }
  },
  jejunal: {
    gastrointestinal: {
      diet: "For jejunal flap, PO intake and DHT per Gen Surg",
      bowelRegimen: "Bowel regimen: miralax, docusate",
      ulcerProphylaxis: "PPI prophylaxis"
    }
  },
  traumaRecon: {
    neuroPainManagement: {
      multimodal: "Multimodal regimen with scheduled Tylenol, celecoxib, tramadol",
      breakthrough: "PRN oxycodone for breakthrough pain",
      traumaRecon: "Trauma recon: Tylenol, NSAID, Oxycodone or Tramadol – no Gabapentin"
    }
  },
  gTube: {
    gastrointestinal: {
      diet: "NPO with G-tube feeding",
      tubeFeeding: "Continue G-tube feeding regimen",
      nutrition: "Consult nutrition for G-tube feeding recommendations",
      bowelRegimen: "Bowel regimen: miralax, docusate",
      ulcerProphylaxis: "PPI prophylaxis"
    }
  }
} as const

// Flap-specific configurations
export const FLAP_CONFIGS = {
  Fibula: {
    extremityCare: "Leg boot x5 days, remove on POD 5",
    dme: "Leg boot for comfort"
  },
  RFFF: {
    extremityCare: "Arm splint required - attending specific management",
    dme: "Arm splint for comfort"
  },
  Scapula: {
    extremityCare: "Shoulder immobilizer (no neck strap)",
    dme: "None required"
  },
  Jejunal: {
    extremityCare: "Abdominal binder x5 days",
    dme: "None required"
  },
  ALT: {
    extremityCare: "Standard care",
    dme: "None required"
  },
  LatissimusDorsi: {
    extremityCare: "Trunk binder x3 days",
    dme: "None required"
  },
  Other: {
    extremityCare: "Standard care",
    dme: "None required"
  }
} as const

// Surgeon options for dropdowns
export const SURGEON_OPTIONS = [
  "Dr. Gleysteen",
  "Dr. Wood", 
  "Dr. Eid"
] as const

// Flap type options
export const FLAP_OPTIONS = [
  "ALT",
  "Fibula", 
  "RFFF",
  "Scapula",
  "Jejunal",
  "LatissimusDorsi",
  "Other"
] as const

// Common procedures for autocomplete
export const COMMON_PROCEDURES = [
  "Laryngectomy",
  "Partial laryngectomy",
  "Total laryngectomy",
  "Pharyngectomy",
  "Partial pharyngectomy",
  "Total pharyngectomy",
  "Glossectomy",
  "Partial glossectomy",
  "Total glossectomy",
  "Mandibulectomy",
  "Partial mandibulectomy",
  "Segmental mandibulectomy",
  "Maxillectomy",
  "Partial maxillectomy",
  "Total maxillectomy",
  "Neck dissection",
  "Selective neck dissection",
  "Modified radical neck dissection",
  "Radical neck dissection",
  "Cutaneous defect reconstruction",
  "Scalp reconstruction",
  "Facial reconstruction",
  "Oral cavity reconstruction",
  "Oropharyngeal reconstruction",
  "Hypopharyngeal reconstruction",
  "Tracheal reconstruction",
  "Esophageal reconstruction"
] as const

// ETT position options
export const ETT_POSITION_OPTIONS = [
  "Left",
  "Right", 
  "Straight",
  "Back"
] as const

// Table position options
export const TABLE_POSITION_OPTIONS = [
  "180 degrees",
  "Straight",
  "90 degrees left",
  "90 degrees right"
] as const

// Yes/No options
export const YES_NO_OPTIONS = [
  "Yes",
  "No"
] as const

// Airway options
export const AIRWAY_OPTIONS = [
  "Nasal ETT",
  "Oral ETT", 
  "Tracheostomy",
  "LMA",
  "Other"
] as const

// Limb protection options
export const LIMB_PROTECTION_OPTIONS = [
  "None",
  "Left arm",
  "Right arm", 
  "Left leg",
  "Right leg",
  "Both arms",
  "Both legs",
  "All limbs"
] as const

// Patient position options
export const PATIENT_POSITION_OPTIONS = [
  "Supine",
  "Lateral",
  "Prone",
  "Beach chair",
  "Other"
] as const

// Antibiotic options
export const ANTIBIOTIC_OPTIONS = [
  "Unasyn",
  "Ancef + Flagyl",
  "Ancef only",
  "Other"
] as const

// Blood loss options
export const BLOOD_LOSS_OPTIONS = [
  "< 500ml",
  "500-1000ml",
  "1000-1500ml",
  "1500-2000ml",
  "> 2000ml"
] as const

// Number of setups options
export const NUMBER_OF_SETUPS_OPTIONS = [
  "1",
  "2", 
  "3",
  "4+"
] as const

// Plating company options
export const PLATING_COMPANY_OPTIONS = [
  "Synthes",
  "Stryker",
  "Depuy",
  "Zimmer",
  "Other"
] as const

// Tracheostomy size options
export const TRACHEOSTOMY_SIZE_OPTIONS = [
  "6UN75H",
  "7UN75H", 
  "8UN75H",
  "Other"
] as const

// Diabetes status options
export const DIABETES_OPTIONS = [
  "None",
  "Type 1", 
  "Type 2",
  "Pre-diabetes"
] as const

// Helper function to get attending from surgeon name
export function getAttendingFromSurgeon(surgeonName: string): Attending {
  if (surgeonName.includes("Gleysteen")) return "Gleysteen"
  if (surgeonName.includes("Eid")) return "Eid"
  if (surgeonName.includes("Wood")) return "Wood"
  return "Gleysteen" // default
}
