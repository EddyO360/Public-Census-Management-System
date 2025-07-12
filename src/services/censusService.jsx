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
  getDoc
} from 'firebase/firestore';
import { db, logAnalyticsEvent } from '../firebase';

const CENSUS_COLLECTION = 'census_data';
const ENUMERATORS_COLLECTION = 'enumerators';

// Save census form data
export const saveCensusData = async (censusData, enumeratorId) => {
  try {
    const docRef = await addDoc(collection(db, CENSUS_COLLECTION), {
      ...censusData,
      enumeratorId,
      submittedAt: new Date(),
      status: 'submitted'
    });

    // Log analytics event
    logAnalyticsEvent('census_form_submitted', {
      enumerator_id: enumeratorId,
      county: censusData.county,
      household_size: censusData.householdSize
    });

    return docRef.id;
  } catch (error) {
    console.error('Error saving census data:', error);
    throw error;
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
    throw error;
  }
};

// Get census data by enumerator
export const getCensusDataByEnumerator = async (enumeratorId) => {
  try {
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
    throw error;
  }
};

// Get census data by county
export const getCensusDataByCounty = async (county) => {
  try {
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
    throw error;
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
    throw error;
  }
};

// Enumerator management
export const saveEnumerator = async (enumeratorData) => {
  try {
    const docRef = await addDoc(collection(db, ENUMERATORS_COLLECTION), {
      ...enumeratorData,
      createdAt: new Date(),
      isActive: true
    });

    logAnalyticsEvent('enumerator_registered', {
      county: enumeratorData.county,
      sub_county: enumeratorData.subCounty
    });

    return docRef.id;
  } catch (error) {
    console.error('Error saving enumerator:', error);
    throw error;
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
    throw error;
  }
};

export const getEnumeratorById = async (enumeratorId) => {
  try {
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
    throw error;
  }
};

export const updateEnumerator = async (enumeratorId, updateData) => {
  try {
    const docRef = doc(db, ENUMERATORS_COLLECTION, enumeratorId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: new Date()
    });

    logAnalyticsEvent('enumerator_updated', {
      enumerator_id: enumeratorId
    });
  } catch (error) {
    console.error('Error updating enumerator:', error);
    throw error;
  }
};

export const deleteEnumerator = async (enumeratorId) => {
  try {
    await deleteDoc(doc(db, ENUMERATORS_COLLECTION, enumeratorId));
    
    logAnalyticsEvent('enumerator_deleted', {
      enumerator_id: enumeratorId
    });
  } catch (error) {
    console.error('Error deleting enumerator:', error);
    throw error;
  }
}; 