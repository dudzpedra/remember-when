import { api } from "../lib/api"
import { Memory } from "../types/memory";

export const getRandomMemory = async (): Promise<Memory> => {
  try {
    const { data } = await api.get('/memories');
    return data;
  } catch (error) {
    console.error('Error getting random memory:', error);
    throw error;
  }
}