import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { SpotOrder } from '../types/exchange';

export interface FirebaseUserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  fiuVerified: boolean;
  kycTier: string;
  panNumber: string;
  tradingMode: 'simple' | 'pro';
  preferredCurrency: 'INR' | 'USD' | 'EUR' | 'GBP';
  createdAt?: unknown;
  updatedAt?: unknown;
}

/**
 * Save or update user profile document in /users/{userId}
 */
export async function syncUserProfile(profile: Partial<FirebaseUserProfile>): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const path = `users/${currentUser.uid}`;
  try {
    const userRef = doc(db, 'users', currentUser.uid);
    await setDoc(
      userRef,
      {
        uid: currentUser.uid,
        email: currentUser.email || 'user@finstockcoin.com',
        displayName: currentUser.displayName || 'Finstock Trader',
        fiuVerified: true,
        kycTier: 'Tier 2',
        panNumber: 'ABCPS1234F',
        tradingMode: profile.tradingMode || 'pro',
        preferredCurrency: profile.preferredCurrency || 'INR',
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Persist an order to Firestore under /users/{userId}/orders/{orderId}
 */
export async function persistOrderToFirestore(order: SpotOrder): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const path = `users/${currentUser.uid}/orders/${order.id}`;
  try {
    const orderRef = doc(db, 'users', currentUser.uid, 'orders', order.id);
    await setDoc(orderRef, {
      id: order.id,
      userId: currentUser.uid,
      pairId: order.pairId,
      side: order.side,
      type: order.type,
      price: order.price,
      amount: order.amount,
      filled: order.filled,
      status: order.status,
      timestamp: order.timestamp,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Load orders from Firestore for the current authenticated user
 */
export async function fetchUserOrdersFromFirestore(): Promise<SpotOrder[]> {
  const currentUser = auth.currentUser;
  if (!currentUser) return [];

  const path = `users/${currentUser.uid}/orders`;
  try {
    const querySnapshot = await getDocs(collection(db, 'users', currentUser.uid, 'orders'));
    const orders: SpotOrder[] = [];
    querySnapshot.forEach((docSnap) => {
      orders.push(docSnap.data() as SpotOrder);
    });
    return orders;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

/**
 * Persist or toggle watchlist pair to Firestore
 */
export async function toggleWatchlistInFirestore(pairId: string, isPinned: boolean): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const path = `users/${currentUser.uid}/watchlist/${pairId}`;
  try {
    const itemRef = doc(db, 'users', currentUser.uid, 'watchlist', pairId);
    if (isPinned) {
      await setDoc(itemRef, {
        pairId,
        userId: currentUser.uid,
        pinnedAt: Date.now(),
      });
    } else {
      await deleteDoc(itemRef);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
