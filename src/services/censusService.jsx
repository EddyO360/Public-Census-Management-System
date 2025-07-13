import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, logAnalyticsEvent } from '../firebase';

const CENSUS_COLLECTION = 'census_data';
const ENUMERATORS_COLLECTION = 'enumerators';

// Validate census data before saving
const validateCensusData = (censusData) => {
  const errors = [];
  
  if (!censusData.firstName?.trim()) errors.push('First name is required');
  if (!censusData.lastName?.trim()) errors.push('Last name is required');
  if (!censusData.idNumber?.trim()) errors.push('ID number is required');
  if (!censusData.dateOfBirth) errors.push('Date of birth is required');
  if (!censusData.gender) errors.push('Gender is required');
  if (!censusData.maritalStatus) errors.push('Marital status is required');
  if (!censusData.county) errors.push('County is required');
  if (!censusData.subCounty) errors.push('Sub-county is required');
  if (!censusData.ward) errors.push('Ward is required');
  if (!censusData.education) errors.push('Education level is required');
  if (!censusData.employment) errors.push('Employment status is required');
  if (!censusData.householdSize || censusData.householdSize < 1) errors.push('Valid household size is required');
  
  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(', ')}`);
  }
  
  return true;
};

// Save census form data
export const saveCensusData = async (censusData, enumeratorId) => {
  try {
    // Validate data before saving
    validateCensusData(censusData);
    
    // Prepare data for saving
    const dataToSave = {
      ...censusData,
      enumeratorId,
      submittedAt: serverTimestamp(),
      status: 'submitted',
      lastUpdated: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, CENSUS_COLLECTION), dataToSave);

    // Log analytics event
    logAnalyticsEvent('census_form_submitted', {
      enumerator_id: enumeratorId,
      county: censusData.county,
      household_size: censusData.householdSize
    });

    return docRef.id;
  } catch (error) {
    console.error('Error saving census data:', error);
    
    // Provide user-friendly error messages
    if (error.message.includes('Validation failed')) {
      throw new Error(error.message);
    } else if (error.code === 'permission-denied') {
      throw new Error('You do not have permission to save census data. Please contact your administrator.');
    } else if (error.code === 'unavailable') {
      throw new Error('Service temporarily unavailable. Please try again later.');
    } else {
      throw new Error('Failed to save census data. Please try again.');
    }
  }
};

// Get all census data for analytics
export const getAllCensusData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, CENSUS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting census data:', error);
    
    if (error.code === 'permission-denied') {
      throw new Error('You do not have permission to view census data.');
    } else if (error.code === 'unavailable') {
      throw new Error('Service temporarily unavailable. Please try again later.');
    } else {
      throw new Error('Failed to load census data. Please try again.');
    }
  }
};

// Get census data by enumerator
export const getCensusDataByEnumerator = async (enumeratorId) => {
  try {
    if (!enumeratorId) {
      throw new Error('Enumerator ID is required');
    }
    
    const q = query(
      collection(db, CENSUS_COLLECTION),
      where('enumeratorId', '==', enumeratorId),
      orderBy('submittedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting enumerator census data:', error);
    
    if (error.message.includes('Enumerator ID is required')) {
      throw new Error(error.message);
    } else if (error.code === 'permission-denied') {
      throw new Error('You do not have permission to view this data.');
    } else {
      throw new Error('Failed to load enumerator data. Please try again.');
    }
  }
};

// Get census data by county
export const getCensusDataByCounty = async (county) => {
  try {
    if (!county) {
      throw new Error('County is required');
    }
    
    const q = query(
      collection(db, CENSUS_COLLECTION),
      where('county', '==', county)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting county census data:', error);
    
    if (error.message.includes('County is required')) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to load county data. Please try again.');
    }
  }
};

// Get statistics for analytics
export const getCensusStatistics = async () => {
  try {
    const allData = await getAllCensusData();
    
    const stats = {
      totalRecords: allData.length,
      genderDistribution: {},
      ageDistribution: {},
      educationDistribution: {},
      employmentDistribution: {},
      countyDistribution: {},
      householdSizeDistribution: {},
      disabilityDistribution: {},
      enumeratorStats: {}
    };

    allData.forEach(record => {
      // Gender distribution
      const gender = record.gender || 'Unknown';
      stats.genderDistribution[gender] = (stats.genderDistribution[gender] || 0) + 1;

      // Age distribution
      const age = record.dateOfBirth ? new Date().getFullYear() - new Date(record.dateOfBirth).getFullYear() : 'Unknown';
      if (typeof age === 'number') {
        const ageGroup = age < 18 ? 'Under 18' : 
                        age < 30 ? '18-29' : 
                        age < 50 ? '30-49' : 
                        age < 65 ? '50-64' : '65+';
        stats.ageDistribution[ageGroup] = (stats.ageDistribution[ageGroup] || 0) + 1;
      }

      // Education distribution
      const education = record.education || 'Unknown';
      stats.educationDistribution[education] = (stats.educationDistribution[education] || 0) + 1;

      // Employment distribution
      const employment = record.employment || 'Unknown';
      stats.employmentDistribution[employment] = (stats.employmentDistribution[employment] || 0) + 1;

      // County distribution
      const county = record.county || 'Unknown';
      stats.countyDistribution[county] = (stats.countyDistribution[county] || 0) + 1;

      // Household size distribution
      const householdSize = record.householdSize || 'Unknown';
      stats.householdSizeDistribution[householdSize] = (stats.householdSizeDistribution[householdSize] || 0) + 1;

      // Disability distribution
      const hasDisability = record.hasDisability || 'Unknown';
      stats.disabilityDistribution[hasDisability] = (stats.disabilityDistribution[hasDisability] || 0) + 1;

      // Enumerator stats
      const enumeratorId = record.enumeratorId || 'Unknown';
      if (!stats.enumeratorStats[enumeratorId]) {
        stats.enumeratorStats[enumeratorId] = 0;
      }
      stats.enumeratorStats[enumeratorId]++;
    });

    return stats;
  } catch (error) {
    console.error('Error getting census statistics:', error);
    throw new Error('Failed to load statistics. Please try again.');
  }
};

// Enumerator management
export const saveEnumerator = async (enumeratorData) => {
  try {
    // Basic validation
    if (!enumeratorData.displayName?.trim()) {
      throw new Error('Display name is required');
    }
    if (!enumeratorData.county) {
      throw new Error('County is required');
    }
    
    const dataToSave = {
      ...enumeratorData,
      createdAt: serverTimestamp(),
      isActive: true,
      lastUpdated: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, ENUMERATORS_COLLECTION), dataToSave);

    logAnalyticsEvent('enumerator_registered', {
      county: enumeratorData.county,
      sub_county: enumeratorData.subCounty
    });

    return docRef.id;
  } catch (error) {
    console.error('Error saving enumerator:', error);
    
    if (error.message.includes('is required')) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to save enumerator data. Please try again.');
    }
  }
};

export const getAllEnumerators = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, ENUMERATORS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting enumerators:', error);
    throw new Error('Failed to load enumerators. Please try again.');
  }
};

export const getEnumeratorById = async (enumeratorId) => {
  try {
    if (!enumeratorId) {
      throw new Error('Enumerator ID is required');
    }
    
    const docRef = doc(db, ENUMERATORS_COLLECTION, enumeratorId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting enumerator:', error);
    
    if (error.message.includes('Enumerator ID is required')) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to load enumerator data. Please try again.');
    }
  }
};

export const updateEnumerator = async (enumeratorId, updateData) => {
  try {
    if (!enumeratorId) {
      throw new Error('Enumerator ID is required');
    }
    
    const docRef = doc(db, ENUMERATORS_COLLECTION, enumeratorId);
    await updateDoc(docRef, {
      ...updateData,
      lastUpdated: serverTimestamp()
    });

    logAnalyticsEvent('enumerator_updated', {
      enumerator_id: enumeratorId
    });
  } catch (error) {
    console.error('Error updating enumerator:', error);
    
    if (error.message.includes('Enumerator ID is required')) {
      throw new Error(error.message);
    } else if (error.code === 'not-found') {
      throw new Error('Enumerator not found.');
    } else {
      throw new Error('Failed to update enumerator. Please try again.');
    }
  }
};

export const deleteEnumerator = async (enumeratorId) => {
  try {
    if (!enumeratorId) {
      throw new Error('Enumerator ID is required');
    }
    
    await deleteDoc(doc(db, ENUMERATORS_COLLECTION, enumeratorId));
    
    logAnalyticsEvent('enumerator_deleted', {
      enumerator_id: enumeratorId
    });
  } catch (error) {
    console.error('Error deleting enumerator:', error);
    
    if (error.message.includes('Enumerator ID is required')) {
      throw new Error(error.message);
    } else if (error.code === 'not-found') {
      throw new Error('Enumerator not found.');
    } else {
      throw new Error('Failed to delete enumerator. Please try again.');
    }
  }
}; 