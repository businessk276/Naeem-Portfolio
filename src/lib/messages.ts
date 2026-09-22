import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import type { ContactMessage } from '../types';
import { db } from './firebase';

export const MESSAGES_COLLECTION = 'contact_messages';

export async function createContactMessage(message: Omit<ContactMessage, 'id' | 'created_at'>) {
  await addDoc(collection(db, MESSAGES_COLLECTION), {
    ...message,
    created_at: new Date().toISOString(),
  });
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const snapshot = await getDocs(collection(db, MESSAGES_COLLECTION));
  return snapshot.docs
    .map((item) => ({ id: item.id, ...(item.data() as Omit<ContactMessage, 'id'>) }))
    .sort((first, second) => second.created_at.localeCompare(first.created_at));
}

export async function deleteContactMessage(messageId: string) {
  await deleteDoc(doc(db, MESSAGES_COLLECTION, messageId));
}