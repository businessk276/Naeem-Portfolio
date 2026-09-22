"use client";

import { useEffect, useState } from "react";
import { getRemotePortfolio, PORTFOLIO_COLLECTION, PORTFOLIO_DOCUMENT } from "../../lib/portfolio";

export default function FirebaseTest() {
  const [message, setMessage] = useState("Testing Firebase...");

  useEffect(() => {
    const testFirebase = async () => {
      try {
        const portfolio = await getRemotePortfolio();
        setMessage(portfolio
          ? `Firebase connected! Found ${PORTFOLIO_COLLECTION}/${PORTFOLIO_DOCUMENT}.`
          : `Firebase connected, but ${PORTFOLIO_COLLECTION}/${PORTFOLIO_DOCUMENT} does not exist yet.`);
      } catch (error) {
        console.error(error);
        setMessage(`Firebase connection failed: ${error}`);
      }
    };

    testFirebase();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>{message}</h1>
    </div>
  );
}