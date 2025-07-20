
export interface User {
  nickname: string;
}

export interface Hazard {
    hazard: string;
    description: string;
}

export interface Disease {
    name: string;
    cause: string;
    precautions: string[];
}

export interface AnalysisResult {
    hazards: Hazard[];
    diseases: Disease[];
    summary: string;
}

export interface LocationAnalysisResult extends AnalysisResult {
    locationName: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'bot';
    text: string;
}

export interface Facility {
  name: string;
  type: 'Hospital' | 'Pharmacy' | 'Clinic';
  lat: number;
  lng: number;
  distance?: string;
}

export interface Medicine {
  name: string;
  dosage: string;
}

export interface PrescriptionAnalysisResult {
  summary: string;
  medicines: Medicine[];
  precautions: string[];
}

export interface RiskFactor {
    name: string;
    level: 'Low' | 'Moderate' | 'High' | 'Very High';
    description: string;
}

export interface HealthForecast {
    locationName: string;
    summary: string;
    riskFactors: RiskFactor[];
    recommendations: string[];
}
