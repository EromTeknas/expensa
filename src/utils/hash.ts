import {sha256} from 'react-native-sha256';

const getHash = async (textToHash: string): Promise<string | null> => {
  try {
    const hash = await sha256(textToHash);
    console.log(hash);  
    return hash;
  } catch (error) {
    console.error('Error generating SHA256 hash:', error);
    return null; // or throw error if you prefer
  }
};

export default getHash;
