/**
 * Server-Authoritative Countdown and Time Synchronization Utilities.
 * Guarantees fair countdowns by calculating and applying the offset between
 * the client device's clock and the authoritative backend server time.
 */

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isExpired: boolean;
  formatted: string;
}

/**
 * Computes offset in milliseconds between server time and local device clock.
 * positive: client clock is behind server
 * negative: client clock is ahead of server
 */
export function calculateServerOffsetMs(serverIsoTimestamp?: string): number {
  if (!serverIsoTimestamp) return 0;
  const serverTimeMs = new Date(serverIsoTimestamp).getTime();
  if (isNaN(serverTimeMs)) return 0;
  const localTimeMs = Date.now();
  return serverTimeMs - localTimeMs;
}

/**
 * Returns current timestamp adjusted by the server offset.
 */
export function getAuthoritativeNow(serverOffsetMs: number = 0): number {
  return Date.now() + serverOffsetMs;
}

/**
 * Calculates remaining time until target ISO date using server-synchronized time.
 */
export function calculateTimeRemaining(
  targetIsoTimestamp: string,
  serverOffsetMs: number = 0
): TimeLeft {
  const targetTimeMs = new Date(targetIsoTimestamp).getTime();
  if (isNaN(targetTimeMs)) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isExpired: true,
      formatted: '00:00:00',
    };
  }

  const currentSyncedTimeMs = getAuthoritativeNow(serverOffsetMs);
  const diffMs = targetTimeMs - currentSyncedTimeMs;

  if (diffMs <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isExpired: true,
      formatted: '00:00:00',
    };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  let formatted = '';
  if (days > 0) {
    formatted = `${days}d ${pad(hours)}h ${pad(minutes)}m`;
  } else {
    formatted = `${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`;
  }

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    isExpired: false,
    formatted,
  };
}

/**
 * Formats relative timestamp for feeds (e.g. "Just now", "2m ago")
 */
export function formatRelativeTime(isoTimestamp: string): string {
  const timeMs = new Date(isoTimestamp).getTime();
  if (isNaN(timeMs)) return '';
  const nowMs = Date.now();
  const diffSec = Math.max(0, Math.floor((nowMs - timeMs) / 1000));

  if (diffSec < 15) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

