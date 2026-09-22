import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import type { PortfolioData } from '../types';
import { db } from './firebase';

export const PORTFOLIO_COLLECTION = 'portfolio';
export const PORTFOLIO_DOCUMENT = 'JubartPortfolio';

const portfolioDocument = doc(db, PORTFOLIO_COLLECTION, PORTFOLIO_DOCUMENT);

export async function getRemotePortfolio(): Promise<PortfolioData | null> {
  const snapshot = await getDoc(portfolioDocument);
  return snapshot.exists() ? (snapshot.data() as PortfolioData) : null;
}

export async function saveRemotePortfolio(portfolio: PortfolioData) {
  await setDoc(portfolioDocument, {
    ...portfolio,
    _updatedAt: serverTimestamp(),
  });
}