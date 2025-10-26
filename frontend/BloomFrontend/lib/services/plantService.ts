import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit, doc, updateDoc, deleteDoc, getDoc, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase/config';
import axios, { isAxiosError } from 'axios';
import { incrementPlantCount } from './auth';

const API_BASE_URL = 'http://localhost:3000';

interface ImageFile {
    uri: string;
    name: string;
    type: string;
}

interface PlantIdentificationResult {
    plantnet: {
        raw: any;
        best_result: any;
        scientific_name: string;
        common_names: string[];
        family: string;
        score: number;
    };
    ai: {
        scientific_name: string;
        common_names: string[];
        family: string;
        category: string;
        short_description: string;
        care: {
            watering: string;
            sunlight: string;
            soil: string;
            temperature: string;
            fertilizer: string;
            pruning: string;
        };
        pests_and_diseases: string;
        medicinal_use: string;
        pet_friendly: string;
        typical_health_issues: string;
        recommended_action: string;
    };
}

export interface PlantRecord {
    id?: string;
    scientific_name: string;
    common_names: string[];
    family: string;
    category: string;
    description: string;
    care_instructions: {
        watering: string;
        sunlight: string;
        soil: string;
        temperature: string;
        fertilizer: string;
        pruning: string;
    };
    health_info: {
        pests_and_diseases: string;
        typical_issues: string;
        recommended_action: string;
    };
    additional_info: {
        medicinal_use: string;
        pet_friendly: string;
        edible_parts?: string[];
        toxicity_level?: string;
    };
    identification_data: {
        confidence_score: number;
        source: 'camera' | 'gallery' | 'manual';
        identified_at: any;
    };
    media: {
        primary_image: string;
        additional_images?: string[];
    };
    user_notes?: string;
    is_favorite: boolean;
    tags: string[];
    location?: {
        latitude: number;
        longitude: number;
        address?: string;
    };
    created_at: any;
    updated_at: any;
    user_id: string;
}

export async function identifyPlant(imageFiles: ImageFile[], organs?: string[]): Promise<PlantIdentificationResult> {
    try {
        const formData = new FormData();
        
        imageFiles.forEach((file, index) => {
            const organ = organs?.[index] || 'leaf';
            formData.append('organs', organ);
            formData.append('images', {
                uri: file.uri,
                name: file.name,
                type: file.type,
            } as any);
        });

        const response = await axios.post(`${API_BASE_URL}/api/identify`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 30000,
        });

        return response.data;
    } catch (error) {
        const errorMessage = isAxiosError(error) 
            ? error.response?.data?.error || error.message 
            : (error as Error).message;
        throw new Error(errorMessage);
    }
}

export async function savePlantRecord(result: PlantIdentificationResult, imageUri: string, source: 'camera' | 'gallery' = 'camera'): Promise<string> {
    const auth = getAuth();
    const userId = auth.currentUser?.uid || 'anonymous';

    // Skip saving if no authentication - just return a mock ID
    if (!auth.currentUser) {
        console.log('Skipping save - no authentication');
        return 'mock-id-' + Date.now();
    }

    const plantRecord: Omit<PlantRecord, 'id'> = {
        scientific_name: result.ai.scientific_name || result.plantnet.scientific_name,
        common_names: result.ai.common_names || result.plantnet.common_names || [],
        family: result.ai.family || result.plantnet.family,
        category: result.ai.category || 'Unknown',
        description: result.ai.short_description || '',
        care_instructions: {
            watering: result.ai.care?.watering || '',
            sunlight: result.ai.care?.sunlight || '',
            soil: result.ai.care?.soil || '',
            temperature: result.ai.care?.temperature || '',
            fertilizer: result.ai.care?.fertilizer || '',
            pruning: result.ai.care?.pruning || ''
        },
        health_info: {
            pests_and_diseases: result.ai.pests_and_diseases || '',
            typical_issues: result.ai.typical_health_issues || '',
            recommended_action: result.ai.recommended_action || ''
        },
        additional_info: {
            medicinal_use: result.ai.medicinal_use || '',
            pet_friendly: result.ai.pet_friendly || ''
        },
        identification_data: {
            confidence_score: result.plantnet.score || 0,
            source,
            identified_at: serverTimestamp()
        },
        media: {
            primary_image: imageUri
        },
        is_favorite: false,
        tags: [],
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        user_id: userId
    };

    try {
        const docRef = await addDoc(collection(db, 'plants'), plantRecord);
        
        // Increment user's plant count
        await incrementPlantCount(userId);
        
        console.log('Plant saved with ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error saving plant record:', error);
        throw new Error('Failed to save plant record');
    }
}

export async function getUserPlants(userId?: string): Promise<PlantRecord[]> {
    const auth = getAuth();
    const currentUserId = userId || auth.currentUser?.uid;

    if (!currentUserId) {
        // Return empty array instead of throwing error
        return [];
    }
    
    try {
        const q = query(
            collection(db, 'plants'),
            where('user_id', '==', currentUserId),
            orderBy('created_at', 'desc'),
            limit(100)
        );
        
        const querySnapshot = await getDocs(q);
        const plants = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as PlantRecord[];
        
        return plants;
    } catch (error) {
        console.error('Error fetching user plants:', error);
        // Return empty array instead of throwing error
        return [];
    }
}

export async function getPlantById(plantId: string): Promise<PlantRecord | null> {
    try {
        const docRef = doc(db, 'plants', plantId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as PlantRecord;
        }
        return null;
    } catch (error) {
        console.error('Error fetching plant:', error);
        throw error;
    }
}

export async function updatePlantRecord(plantId: string, updates: Partial<PlantRecord>): Promise<void> {
    try {
        await updateDoc(doc(db, 'plants', plantId), {
            ...updates,
            updated_at: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating plant:', error);
        throw error;
    }
}

export async function deletePlantRecord(plantId: string): Promise<void> {
    try {
        await deleteDoc(doc(db, 'plants', plantId));
    } catch (error) {
        console.error('Error deleting plant:', error);
        throw error;
    }
}

export async function toggleFavorite(plantId: string, isFavorite: boolean): Promise<void> {
    try {
        await updateDoc(doc(db, 'plants', plantId), {
            is_favorite: isFavorite,
            updated_at: serverTimestamp()
        });
    } catch (error) {
        console.error('Error toggling favorite:', error);
        throw error;
    }
}

export async function addPlantNote(plantId: string, note: string): Promise<void> {
    try {
        await updateDoc(doc(db, 'plants', plantId), {
            user_notes: note,
            updated_at: serverTimestamp()
        });
    } catch (error) {
        console.error('Error adding note:', error);
        throw error;
    }
}

export async function addPlantTags(plantId: string, tags: string[]): Promise<void> {
    try {
        await updateDoc(doc(db, 'plants', plantId), {
            tags,
            updated_at: serverTimestamp()
        });
    } catch (error) {
        console.error('Error adding tags:', error);
        throw error;
    }
}

export async function identifyPlantByName(name: string): Promise<PlantIdentificationResult> {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/identify`, {
            params: { name },
            timeout: 30000,
        });
        return response.data;
    } catch (error) {
        const errorMessage = isAxiosError(error) 
            ? error.response?.data?.error || error.message 
            : (error as Error).message;
        throw new Error(errorMessage);
    }
}

export async function getLocationRecommendations(latitude: number, longitude: number, address?: string) {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/recommend`, {
            latitude,
            longitude,
            address,
        }, {
            timeout: 30000,
        });
        return response.data;
    } catch (error) {
        const errorMessage = isAxiosError(error) 
            ? error.response?.data?.error || error.message 
            : (error as Error).message;
        throw new Error(errorMessage);
    }
}

// Legacy function for backward compatibility
export const getPlantHistory = getUserPlants;
export const saveToHistory = savePlantRecord;
