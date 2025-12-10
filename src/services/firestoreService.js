import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Save symptom log
export const saveSymptomLog = async (userId, symptomData) => {
  try {
    const docRef = await addDoc(collection(db, 'symptomLogs'), {
      userId,
      symptom: symptomData.symptom,
      severity: symptomData.severity,
      trigger: symptomData.trigger,
      notes: symptomData.notes,
      timestamp: serverTimestamp(),
      date: symptomData.date,
      time: symptomData.time
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Save symptom log error:', error);
    return { success: false, error: error.message };
  }
};

// Get user's symptom logs
export const getSymptomLogs = async (userId) => {
  try {
    const q = query(
      collection(db, 'symptomLogs'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const logs = [];
    querySnapshot.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: logs };
  } catch (error) {
    console.error('Get symptom logs error:', error);
    return { success: false, error: error.message };
  }
};

// Delete symptom log
export const deleteSymptomLog = async (logId) => {
  try {
    await deleteDoc(doc(db, 'symptomLogs', logId));
    return { success: true };
  } catch (error) {
    console.error('Delete symptom log error:', error);
    return { success: false, error: error.message };
  }
};

// Save questionnaire data
export const saveQuestionnaireData = async (userId, questionnaireData) => {
  try {
    const docRef = doc(db, 'questionnaires', userId);
    await updateDoc(docRef, {
      ...questionnaireData,
      updatedAt: serverTimestamp()
    }).catch(async () => {
      // If document doesn't exist, create it
      await addDoc(collection(db, 'questionnaires'), {
        userId,
        ...questionnaireData,
        createdAt: serverTimestamp()
      });
    });
    return { success: true };
  } catch (error) {
    console.error('Save questionnaire error:', error);
    return { success: false, error: error.message };
  }
};

// Get questionnaire data
export const getQuestionnaireData = async (userId) => {
  try {
    const q = query(
      collection(db, 'questionnaires'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { success: true, data: doc.data() };
    }
    return { success: false, error: 'No questionnaire data found' };
  } catch (error) {
    console.error('Get questionnaire error:', error);
    return { success: false, error: error.message };
  }
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      ...profileData,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, error: error.message };
  }
};
