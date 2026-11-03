'use client';

import { useState, useEffect } from 'react';
import { calculateServerOffsetMs, calculateTimeRemaining, TimeLeft } from '@/lib/utils/time';

export function useCountdown(closesAt?: string, serverTime?: string): TimeLeft {
  const [serverOffsetMs, setServerOffsetMs] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    closesAt
      ? calculateTimeRemaining(closesAt, calculateServerOffsetMs(serverTime))
      : {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalSeconds: 0,
          isExpired: true,
          formatted: '00:00:00',
        }
  );

  useEffect(() => {
    if (serverTime) {
      setServerOffsetMs(calculateServerOffsetMs(serverTime));
    }
  }, [serverTime]);

  useEffect(() => {
    if (!closesAt) return;

    // Immediately calculate
    setTimeLeft(calculateTimeRemaining(closesAt, serverOffsetMs));

    const interval = setInterval(() => {
      const updated = calculateTimeRemaining(closesAt, serverOffsetMs);
      setTimeLeft(updated);
      if (updated.isExpired) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [closesAt, serverOffsetMs]);

  return timeLeft;
}

