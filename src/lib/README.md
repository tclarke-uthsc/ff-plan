# Configuration Guide

## Overview
The `config.ts` file contains all the centralized configuration for the Free Flap Planner app. This makes it easy to modify attending preferences, flap configurations, and other options without digging through the code.

## Key Configuration Sections

### 1. Base Plan (`BASE_PLAN`)
Contains the common features across all attendings - this is the default plan that everyone follows:

- **flapManagement**: Flap monitoring and care instructions
- **importantRestrictions**: Critical restrictions and contraindications
- **neuroPainManagement**: Pain management protocols
- **cardiovascular**: Cardiovascular monitoring and management
- **respiratory**: Airway and respiratory care
- **gastrointestinal**: Nutrition and GI management
- **renalGu**: Renal and genitourinary care
- **infectiousDisease**: Antibiotic and infection prevention protocols
- **endocrine**: Endocrine management (steroids, glucose control)
- **hematology**: Anticoagulation and hematologic management
- **woundCare**: Wound care and drain management
- **additionalOrders**: Home medications and consults

### 2. Attending Preferences (`ATTENDING_PREFERENCES`)
Contains all surgeon-specific protocols and preferences:

- **aspirinDuration**: How long to prescribe aspirin (1 week vs 3 weeks)
- **dopplerManagement**: How to handle doppler removal on POD 5
- **stsgManagement**: Wound VAC and STSG care protocols
- **stapleRemoval**: When to remove staples (varies by location and radiation status)
- **dischargeWoundCare**: Home wound care instructions
- **extremityCare**: Flap-specific extremity care protocols
- **planOverrides**: Custom content for specific plan sections (overrides base plan)

### 3. Modifier Overrides (`MODIFIER_OVERRIDES`)
Contains plan section overrides based on patient modifiers:

- **laryngectomy**: Custom respiratory and consult protocols for laryngectomy patients
- **priorRadiation**: Extended NPO duration and modified GI protocols for radiated patients
- **diabetes**: Enhanced endocrine monitoring for diabetic patients
- **oralCavityAerodigestive**: Additional wound care protocols for oral cavity reconstruction

### 4. Flap Configurations (`FLAP_CONFIGS`)
Contains flap-specific care requirements:

- **extremityCare**: Specific care instructions for each flap type
- **dme**: Durable medical equipment needed for discharge

### 5. Dropdown Options
- **SURGEON_OPTIONS**: Available surgeons in dropdowns
- **FLAP_OPTIONS**: Available flap types
- **COMMON_PROCEDURES**: Autocomplete suggestions for planned procedures
- **ETT_POSITION_OPTIONS**: Endotracheal tube position options
- **TABLE_POSITION_OPTIONS**: Operating table position options

## How to Edit

### Modifying the Base Plan
Edit the content in `BASE_PLAN` to change what appears in the Plan of the Day for all attendings. This is the common protocol that everyone follows.

### Adding Attending-Specific Overrides
Add custom content to `planOverrides` in `ATTENDING_PREFERENCES` to override specific sections for individual attendings. Only specify what's different from the base plan.

### Adding Modifier-Specific Overrides
Add custom content to `MODIFIER_OVERRIDES` to override specific sections based on patient modifiers. This allows the plan to automatically adapt based on patient characteristics.

### Adding a New Attending
1. Add the surgeon to `SURGEON_OPTIONS`
2. Add their preferences to `ATTENDING_PREFERENCES`
3. Add any custom plan section overrides to `planOverrides`
4. Update the `getAttendingFromSurgeon` function if needed

### Modifying Existing Preferences
Simply edit the values in `ATTENDING_PREFERENCES` for the specific attending.

### Adding New Procedures
Add new procedures to the `COMMON_PROCEDURES` array for autocomplete suggestions.

### Adding New Flap Types
1. Add to `FLAP_OPTIONS`
2. Add configuration to `FLAP_CONFIGS`
3. Update the `FLAP_TYPES` array in `AttendingFlapStep.tsx`

## Example: Changing Eid's Aspirin Duration
```typescript
Eid: {
  aspirinDuration: "4 weeks", // Changed from "3 weeks"
  // ... rest of preferences
}
```

## Example: Adding a New Procedure
```typescript
export const COMMON_PROCEDURES = [
  "Laryngectomy",
  "New Procedure Name", // Add here
  // ... rest of procedures
] as const
```

## Example: Customizing a Plan Section for Eid
```typescript
Eid: {
  // ... other preferences
  planOverrides: {
    neuroPainManagement: [
      "Custom pain management for Eid",
      "Special considerations for trauma cases",
      "Modified gabapentin protocol"
    ]
  }
}
```

## Example: Adding a New Plan Section
```typescript
export const BASE_PLAN = {
  // ... existing sections
  newSection: {
    title: "New Section Title",
    content: [
      "Base instruction 1",
      "Base instruction 2"
    ]
  }
} as const
```

## Example: Adding a New Modifier Override
```typescript
export const MODIFIER_OVERRIDES = {
  // ... existing modifiers
  newModifier: {
    cardiovascular: [
      "Custom cardiovascular protocol for this modifier",
      "Additional monitoring requirements"
    ]
  }
} as const
```

## Override Priority
The system uses the following priority order:
1. **Attending overrides** (highest priority)
2. **Modifier overrides** (medium priority) 
3. **Base plan** (default)

All changes will automatically be reflected throughout the app without needing to modify other files.
