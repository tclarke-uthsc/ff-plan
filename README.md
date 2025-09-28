# Free Flap Planner

A comprehensive React + TypeScript application for generating surgical planning documents for free flap procedures. This wizard-based application helps medical professionals create standardized plans of the day, anticipated post-operative courses, and daily progress notes.

## Features

- **Multi-step Wizard Interface**: Guided form with 5 steps covering all aspects of free flap planning
- **Adaptive Prompts**: Questions and options adapt based on attending surgeon, flap type, and case modifiers
- **Three Output Documents**:
  - Plan of the Day (OR/anesthesia-facing)
  - Anticipated Post-op Course (attending + flap + modifiers)
  - Daily Progress Note (progress vs anticipated course)
- **Data Persistence**: Form data is automatically saved to localStorage
- **Export Functionality**: Copy to clipboard or download as text files
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Zustand** for state management with persistence
- **Zod** for form validation
- **Lucide React** for icons
- **Sonner** for toast notifications

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the provided local URL (typically `http://localhost:5173`)

## Usage

1. **Patient Information**: Enter patient name, MRN, date, diagnosis, and planned procedures
2. **Attending & Flap**: Select the attending surgeon and flap type
3. **Modifiers**: Check any applicable case modifiers (oral cavity/aerodigestive, laryngectomy, prior radiation)
4. **Intraoperative Planning**: Complete detailed anesthesia and nursing setup information
5. **Review**: Review all entered information before generating notes
6. **Generate Notes**: Create the three output documents with copy/export functionality

## Adaptive Features

The application includes intelligent adaptations based on selections:

- **Laryngectomy**: Shows tracheostomy size options and esophagram messaging
- **Prior Radiation**: Adjusts NPO periods and healing protocols
- **Flap-specific**: 
  - Fibula: Leg boot and neurocheck protocols
  - RFFF: Forearm splint protocols per attending
  - ALT: Thigh STSG care instructions
  - Scapula: Shoulder immobilizer protocols
- **Attending-specific**: Different protocols for Dr. Gleysteen, Dr. Eid, and Dr. Wood

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## License

This project is for medical education and clinical use. Please ensure compliance with your institution's policies and regulations.