import { getFirestore, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function checkAndConsumeCall(uid: string): Promise<void> {
  const db = getFirestore();
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) throw new Error('Utilisateur introuvable');
  const data = userSnap.data();
  const { trialStart, usageCount = 0, freeCalls = 5, paidPlan = false } = data;

  if (paidPlan === true) return;

  const now = Date.now();
  const trialStartMs = trialStart?.toMillis ? trialStart.toMillis() : (trialStart?.seconds ? trialStart.seconds * 1000 : 0);
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  if (usageCount < freeCalls && (now - trialStartMs < sevenDaysMs)) {
    await updateDoc(userRef, { usageCount: usageCount + 1 });
    return;
  }
  throw new Error('Essai gratuit terminé – souscris un plan');
} 