
import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { AnalysisResult, LocationAnalysisResult, Facility, PrescriptionAnalysisResult, HealthForecast } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const locationAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        locationName: { type: Type.STRING, description: "The short name of the identified location (e.g., 'Central Park, New York, USA')." },
        hazards: {
            type: Type.ARRAY,
            description: "A list of identified potential health hazards based on the location's geography and climate.",
            items: {
                type: Type.OBJECT,
                properties: {
                    hazard: { type: Type.STRING, description: "The specific hazard identified, e.g., 'Stagnant Water Pool'." },
                    description: { type: Type.STRING, description: "A brief description of why this hazard is relevant to the location." }
                },
                required: ["hazard", "description"]
            }
        },
        diseases: {
            type: Type.ARRAY,
            description: "A list of potential diseases associated with the identified hazards.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Name of the potential disease, e.g., 'Malaria'." },
                    cause: { type: Type.STRING, description: "How the identified hazards can cause this disease." },
                    precautions: {
                        type: Type.ARRAY,
                        description: "A list of practical preventive measures against this disease.",
                        items: { type: Type.STRING }
                    }
                },
                required: ["name", "cause", "precautions"]
            }
        },
        summary: {
            type: Type.STRING,
            description: "A concise overall summary of the environmental health assessment, written in an urgent but informative tone."
        }
    },
    required: ["locationName", "hazards", "diseases", "summary"]
};

export const analyzeLocationByCoordinates = async (lat: number, lng: number): Promise<{ analysis: LocationAnalysisResult, imageUrl: string }> => {
    const [analysisResponse, imageResponse] = await Promise.all([
        ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a geographical and environmental health expert named GeoSick. Given the coordinates latitude: ${lat}, longitude: ${lng}:
            1.  Determine the plausible city, region, and country. Provide a short, user-friendly location name.
            2.  Based on the typical geography, climate, and environment of this location, describe the most common potential environmental health hazards.
            3.  List potential diseases associated with these hazards, their causes, and practical preventive measures.
            4.  Provide a concise overall summary of the assessment.
            Your response must be in JSON format conforming to the provided schema.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: locationAnalysisSchema,
            }
        }),
        ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: `Generate a realistic but generic satellite or high-angle neighborhood photograph for a location at latitude ${lat}, longitude ${lng}. Show a typical environmental setting. Avoid showing specific landmarks or text.`,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '16:9',
            },
        })
    ]);

    let analysis: LocationAnalysisResult;
    try {
        const jsonText = analysisResponse.text.trim();
        analysis = JSON.parse(jsonText) as LocationAnalysisResult;
    } catch (e) {
        console.error("Failed to parse JSON from analysis:", analysisResponse.text);
        throw new Error("The model returned an invalid data format for the location analysis.");
    }
    
    if (!imageResponse.generatedImages || imageResponse.generatedImages.length === 0) {
        throw new Error("The model failed to generate an image for the location.");
    }
    const base64ImageBytes = imageResponse.generatedImages[0].image.imageBytes;
    const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;

    return { analysis, imageUrl };
};

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        hazards: {
            type: Type.ARRAY,
            description: "A list of identified potential health hazards in the image.",
            items: {
                type: Type.OBJECT,
                properties: {
                    hazard: { type: Type.STRING, description: "The specific hazard identified, e.g., 'Stagnant Water Pool'." },
                    description: { type: Type.STRING, description: "A brief description of the hazard and its location in the image." }
                },
                required: ["hazard", "description"]
            }
        },
        diseases: {
            type: Type.ARRAY,
            description: "A list of potential diseases associated with the identified hazards.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Name of the potential disease, e.g., 'Malaria'." },
                    cause: { type: Type.STRING, description: "How the identified hazards can cause this disease." },
                    precautions: {
                        type: Type.ARRAY,
                        description: "A list of practical preventive measures against this disease.",
                        items: { type: Type.STRING }
                    }
                },
                required: ["name", "cause", "precautions"]
            }
        },
        summary: {
            type: Type.STRING,
            description: "A concise overall summary of the environmental health assessment, written in an urgent but informative tone."
        }
    },
    required: ["hazards", "diseases", "summary"]
};

export const analyzeImage = async (base64ImageData: string): Promise<AnalysisResult> => {
    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: base64ImageData,
        },
    };

    const textPart = {
        text: `You are an expert environmental health and public safety analyst named GeoSick. Analyze the provided image of a geographical area.
        1.  **Identify Potential Health Hazards:** Pinpoint any visible issues such as stagnant water, garbage piles, pollution, pests, or poor sanitation. Be specific.
        2.  **Predict Associated Diseases:** Based on the identified hazards, list potential diseases (e.g., Malaria from stagnant water, Cholera from contaminated water sources, respiratory issues from air pollution).
        3.  **Provide a Detailed Report:** Synthesize your findings into a clear, structured report.
        4.  **Suggest Actionable Precautions:** For each potential disease, provide a list of practical and effective preventive measures for individuals and the community.
        Your response must be in JSON format conforming to the provided schema.`
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: analysisSchema
        }
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as AnalysisResult;
    } catch (e) {
        console.error("Failed to parse JSON response:", response.text);
        throw new Error("The model returned an invalid data format.");
    }
};

const prescriptionAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "A concise summary of the prescription's purpose in simple, easy-to-understand language. Start with 'This prescription is for...'."
        },
        medicines: {
            type: Type.ARRAY,
            description: "A list of all prescribed medicines found in the image.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "The name of the medicine." },
                    dosage: { type: Type.STRING, description: "The dosage and frequency instructions (e.g., '500mg, twice a day for 7 days')." }
                },
                required: ["name", "dosage"]
            }
        },
        precautions: {
            type: Type.ARRAY,
            description: "A list of important precautions or advice mentioned in the prescription (e.g., 'Take with food', 'Avoid driving').",
            items: { type: Type.STRING }
        }
    },
    required: ["summary", "medicines", "precautions"]
};


export const analyzePrescription = async (base64ImageData: string): Promise<PrescriptionAnalysisResult> => {
    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: base64ImageData,
        },
    };

    const textPart = {
        text: `You are an expert medical transcriptionist. Analyze the provided image of a doctor's prescription, which may be handwritten or typed.
        1.  **Interpret the content:** Carefully read all text on the prescription.
        2.  **Extract Key Information:** Identify all prescribed medicines and their exact dosages/instructions.
        3.  **Identify Precautions:** Note any special warnings, advice, or precautions mentioned.
        4.  **Summarize:** Provide a brief, simple summary of the prescription's purpose.
        If any part of the prescription is illegible, state that clearly in the relevant field (e.g., 'Dosage illegible'). Do not guess.
        Your response must be in JSON format conforming to the provided schema.`
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: prescriptionAnalysisSchema
        }
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as PrescriptionAnalysisResult;
    } catch (e) {
        console.error("Failed to parse JSON from prescription analysis:", response.text);
        throw new Error("The model returned an invalid data format for the prescription.");
    }
};


let chatInstance: Chat | null = null;

export const startChat = (): Chat => {
    if (!chatInstance) {
        chatInstance = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are a friendly and knowledgeable medical chatbot for the GeoSick application. Your purpose is to answer questions about diseases, their causes, symptoms, and prevention. Do not provide medical diagnoses or prescribe treatments. Always advise users to consult a healthcare professional for personal health concerns. Keep your answers clear, concise, and easy to understand.`,
            },
        });
    }
    return chatInstance;
};

export const sendMessageToBotStream = async (chat: Chat, message: string) => {
    return await chat.sendMessageStream({ message });
};


const geocodeSchema = {
    type: Type.OBJECT,
    properties: {
        lat: { type: Type.NUMBER, description: "Latitude coordinate" },
        lng: { type: Type.NUMBER, description: "Longitude coordinate" },
    },
    required: ["lat", "lng"],
};

export const geocodeLocation = async (locationName: string): Promise<{ lat: number; lng: number }> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Provide the precise latitude and longitude for the center of the following location: "${locationName}".`,
        config: {
            responseMimeType: "application/json",
            responseSchema: geocodeSchema,
        }
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as { lat: number, lng: number };
    } catch (e) {
        console.error("Failed to parse JSON from geocoding:", response.text);
        throw new Error("The model returned an invalid data format for geocoding.");
    }
};

const facilitiesSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "The official name of the facility." },
            type: { type: Type.STRING, enum: ['Hospital', 'Clinic', 'Pharmacy'], description: "The type of the facility." },
            lat: { type: Type.NUMBER, description: "The latitude coordinate of the facility." },
            lng: { type: Type.NUMBER, description: "The longitude coordinate of the facility." },
        },
        required: ["name", "type", "lat", "lng"],
    },
};

export const findFacilitiesByCoordinates = async (coords: { lat: number; lng: number }): Promise<Omit<Facility, 'distance'>[]> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `List real-world, public-facing hospitals, clinics, and pharmacies within a 5km radius of latitude ${coords.lat} and longitude ${coords.lng}. Exclude any other type of place. For each, provide its name, type (must be one of: Hospital, Clinic, Pharmacy), and its precise latitude and longitude.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: facilitiesSchema,
        }
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Omit<Facility, 'distance'>[];
    } catch (e) {
        console.error("Failed to parse JSON from facility search:", response.text);
        throw new Error("The model returned an invalid data format for facilities.");
    }
};

const healthForecastSchema = {
    type: Type.OBJECT,
    properties: {
        locationName: { type: Type.STRING, description: "The name of the city/area for the forecast." },
        summary: { type: Type.STRING, description: "A concise, 1-2 sentence summary of the overall health outlook for the day." },
        riskFactors: {
            type: Type.ARRAY,
            description: "A list of key health risk factors for the day.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Name of the risk factor (e.g., 'Air Quality', 'Pollen Count', 'UV Index')." },
                    level: { type: Type.STRING, enum: ['Low', 'Moderate', 'High', 'Very High'], description: "The assessed risk level." },
                    description: { type: Type.STRING, description: "A brief explanation of the risk." }
                },
                required: ["name", "level", "description"]
            }
        },
        recommendations: {
            type: Type.ARRAY,
            description: "A list of 2-4 actionable recommendations for the user based on the risks.",
            items: { type: Type.STRING }
        }
    },
    required: ["locationName", "summary", "riskFactors", "recommendations"]
};


export const getHealthForecast = async (coords: { lat: number; lng: number }): Promise<HealthForecast> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are GeoSick, a health intelligence AI. Act as a health meteorologist. Given the coordinates (latitude: ${coords.lat}, longitude: ${coords.lng}) and today's date, generate a daily health forecast. 
        1. Identify the location (city, country).
        2. Analyze plausible environmental risks for this region and season (e.g., air quality/AQI, pollen levels, UV index, heat stress, risk for common vector-borne diseases like flu or mosquito-borne illnesses).
        3. Output a JSON object with the location name, a summary, an array of 2-4 key risk factors (each with name, level, and description), and an array of 2-4 actionable recommendations. Be creative and base it on plausible environmental data.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: healthForecastSchema,
        }
    });
    
    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as HealthForecast;
    } catch (e) {
        console.error("Failed to parse JSON from health forecast:", response.text);
        throw new Error("The model returned an invalid data format for the health forecast.");
    }
};
