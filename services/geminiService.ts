
import { GoogleGenAI, Type } from "@google/genai";
import { PlantParameters } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const plantGenerationSchema = {
    type: Type.OBJECT,
    properties: {
        mood: {
            type: Type.STRING,
            description: "The dominant mood detected, e.g., Joyful, Melancholic, Anxious.",
        },
        axiom: {
            type: Type.STRING,
            description: "A starting string, always 'F'.",
        },
        rules: {
            type: Type.OBJECT,
            properties: {
                F: { type: Type.STRING, description: "L-System rule for 'F'. E.g. 'FF+[+F-F-F]-[-F+F+F]'" },
            },
            required: ["F"],
        },
        iterations: {
            type: Type.INTEGER,
            description: "An integer between 3 and 5 for complexity.",
        },
        initialAngle: {
            type: Type.INTEGER,
            description: "An integer for starting direction, always -90 for up.",
        },
        turnAngle: {
            type: Type.INTEGER,
            description: "An integer for turn angle, between 15 and 40.",
        },
        branchLength: {
            type: Type.NUMBER,
            description: "Initial branch length, between 8 and 15.",
        },
        lengthFactor: {
            type: Type.NUMBER,
            description: "Factor for branch length change each iteration, between 0.6 and 0.9.",
        },
        strokeWidth: {
            type: Type.NUMBER,
            description: "Branch thickness, between 3 and 8.",
        },
        colorStops: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    offset: { type: Type.STRING, description: "Percentage offset, e.g., '0%'" },
                    color: { type: Type.STRING, description: "Hex color code, e.g., '#aabbcc'" },
                },
                required: ["offset", "color"],
            },
            description: "An array of 2-3 color stops for a gradient.",
        },
    },
    required: ["mood", "axiom", "rules", "iterations", "initialAngle", "turnAngle", "branchLength", "lengthFactor", "strokeWidth", "colorStops"],
};


export const generatePlantFromMood = async (journalText: string): Promise<PlantParameters> => {
  const prompt = `You are an AI that translates human emotions from text into procedural plant generation parameters. Analyze the dominant emotions in the following journal entry and generate a JSON object that defines a unique plant.

  **Emotion Mapping Guide:**
  *   **Joy/Love/Excitement:** Vibrant colors (yellows, pinks, light greens), upward-reaching branches, complex branching. Small turnAngle (15-25 degrees). High iterations (4-5). Rule should be complex like 'F[+FF][-FF]F[+F][-F]FF'.
  *   **Sadness/Grief:** Muted, cool colors (blues, purples, grays), drooping branches (achieved with larger turnAngle), fewer branches. Larger turnAngle (30-45 degrees). Rule should be simple, with downward turns, like 'F[--F][++F]'.
  *   **Anger/Frustration:** Sharp angles, spiky leaves, deep reds and oranges, chaotic structure. High iterations (5) and a jarring turnAngle (20-30). Rule can be asymmetric like 'F[+F-F]F-[-F]F'.
  *   **Fear/Anxiety:** Sparse, thin branches, twisted structure, pale/desaturated colors. Rule could be 'F[+F][-F[--F]]F'.
  *   **Calm/Peace:** Wide, gentle curves, soft greens and blues, simple, elegant structure. Low iterations (3). Consistent turnAngle (22-28). Rule should be balanced and symmetric, like 'FF-[-F+F+F]+[+F-F-F]'.
  
  **Journal Entry:**
  "${journalText}"
  
  Now, generate ONLY the JSON object based on the entry and the guide. Ensure 'axiom' is 'F' and 'initialAngle' is -90.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: plantGenerationSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsedParams = JSON.parse(jsonString) as PlantParameters;
    return parsedParams;

  } catch (error) {
    console.error("Error generating plant from mood:", error);
    throw new Error("Failed to communicate with the generative AI model.");
  }
};
