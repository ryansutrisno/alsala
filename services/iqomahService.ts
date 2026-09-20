export const IQOMAH_OPTIONS = [5, 10, 15, 20, 25, 30] as const;
export type IqomahMinutes = (typeof IQOMAH_OPTIONS)[number];
export const DEFAULT_IQOMAH_MINUTES: IqomahMinutes = 10;

const STORAGE_KEY = 'waqt_iqomah_minutes';
const ALARM_MAX_DURATION_MS = 20_000;
const ALARM_GAIN = 0.15;
const ALARM_INACTIVE_MESSAGE = '[Alarm] AudioContext tidak aktif — alarm butuh interaksi user lebih dulu';

let audioContext: AudioContext | null = null;

interface ActiveAlarm {
  context: AudioContext;
  oscillator: OscillatorNode;
  gain: GainNode;
  patternTimer: ReturnType<typeof setInterval> | null;
  stopTimer: ReturnType<typeof setTimeout> | null;
}

let activeAlarm: ActiveAlarm | null = null;

export function getIqomahMinutes(): IqomahMinutes {
  try {
    const storedValue = localStorage.getItem(STORAGE_KEY);
    const parsedValue = storedValue === null ? Number.NaN : parseInt(storedValue, 10);

    if (IQOMAH_OPTIONS.includes(parsedValue as IqomahMinutes)) {
      return parsedValue as IqomahMinutes;
    }
  } catch {
    // localStorage dapat gagal digunakan, misalnya pada mode private tertentu.
  }

  return DEFAULT_IQOMAH_MINUTES;
}

export function setIqomahMinutes(minutes: IqomahMinutes): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(minutes));
  } catch {
    // Preferensi tetap menggunakan nilai bawaan jika penyimpanan tidak tersedia.
  }
}

export function computeIqomahTarget(prayerTime: string, minutes: number, now: Date = new Date()): Date | null {
  const parts = prayerTime.split(':');

  if (parts.length !== 2 || parts.some((part) => part.trim() === '')) {
    return null;
  }

  const hours = Number(parts[0]);
  const prayerMinutes = Number(parts[1]);

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(prayerMinutes) ||
    hours < 0 ||
    hours > 23 ||
    prayerMinutes < 0 ||
    prayerMinutes > 59
  ) {
    return null;
  }

  const target = new Date(now.getTime());
  target.setHours(hours, prayerMinutes + minutes, 0, 0);
  return target;
}

export function formatCountdown(msLeft: number): string {
  const totalSeconds = Math.max(0, Math.floor(msLeft / 1000));
  const totalMinutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(totalMinutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function warnAudioInactive(): void {
  console.warn(ALARM_INACTIVE_MESSAGE);
}

function createAudioContext(): AudioContext | null {
  if (audioContext) {
    return audioContext;
  }

  try {
    if (typeof window === 'undefined' || typeof window.AudioContext !== 'function') {
      warnAudioInactive();
      return null;
    }

    audioContext = new window.AudioContext();
    return audioContext;
  } catch {
    warnAudioInactive();
    return null;
  }
}

function resumeAudioContext(context: AudioContext): void {
  try {
    void context.resume().then(() => {
      if (context.state === 'suspended') {
        warnAudioInactive();
      }
    }).catch(() => {
      warnAudioInactive();
    });
  } catch {
    warnAudioInactive();
  }
}

export function unlockAlarmAudio(): void {
  const context = createAudioContext();

  if (!context || context.state !== 'suspended') {
    return;
  }

  resumeAudioContext(context);
}

function scheduleAdzanPattern(alarm: ActiveAlarm, context: AudioContext): void {
  const scheduleBeeps = (): void => {
    const startTime = context.currentTime;
    const gainParam = alarm.gain.gain;

    gainParam.cancelScheduledValues(startTime);
    gainParam.setValueAtTime(0, startTime);
    gainParam.linearRampToValueAtTime(ALARM_GAIN, startTime + 0.02);
    gainParam.setValueAtTime(ALARM_GAIN, startTime + 0.23);
    gainParam.linearRampToValueAtTime(0, startTime + 0.25);
    gainParam.setValueAtTime(0, startTime + 0.5);
    gainParam.linearRampToValueAtTime(ALARM_GAIN, startTime + 0.52);
    gainParam.setValueAtTime(ALARM_GAIN, startTime + 0.73);
    gainParam.linearRampToValueAtTime(0, startTime + 0.75);
  };

  scheduleBeeps();
  alarm.patternTimer = setInterval(scheduleBeeps, 1_750);
}

function scheduleIqomahPattern(alarm: ActiveAlarm, context: AudioContext): void {
  let highTone = false;
  const frequencyParam = alarm.oscillator.frequency;
  const gainParam = alarm.gain.gain;
  const startTime = context.currentTime;

  frequencyParam.setValueAtTime(740, startTime);
  gainParam.setValueAtTime(0, startTime);
  gainParam.linearRampToValueAtTime(ALARM_GAIN, startTime + 0.02);

  const switchTone = (): void => {
    highTone = !highTone;
    const switchTime = context.currentTime;
    const nextFrequency = highTone ? 988 : 740;

    frequencyParam.cancelScheduledValues(switchTime);
    frequencyParam.setValueAtTime(frequencyParam.value, switchTime);
    frequencyParam.linearRampToValueAtTime(nextFrequency, switchTime + 0.02);
  };

  alarm.patternTimer = setInterval(switchTone, 700);
}

function disconnectAudioNodes(oscillator: OscillatorNode | null, gain: GainNode | null): void {
  if (oscillator) {
    try {
      oscillator.disconnect();
    } catch {
      // Node sudah terputus atau tidak sempat tersambung.
    }
  }

  if (gain) {
    try {
      gain.disconnect();
    } catch {
      // Node sudah terputus atau tidak sempat tersambung.
    }
  }
}

export type AlarmKind = 'adzan-manual' | 'iqomah';

export function playAlarm(kind: AlarmKind): void {
  stopAlarm();

  const context = createAudioContext();
  if (!context) {
    return;
  }

  if (context.state === 'suspended') {
    resumeAudioContext(context);
    return;
  }

  if (context.state !== 'running') {
    warnAudioInactive();
    return;
  }

  let oscillator: OscillatorNode | null = null;
  let gain: GainNode | null = null;

  try {
    oscillator = context.createOscillator();
    gain = context.createGain();
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();

    const alarm: ActiveAlarm = {
      context,
      oscillator,
      gain,
      patternTimer: null,
      stopTimer: null,
    };
    activeAlarm = alarm;

    if (kind === 'adzan-manual') {
      oscillator.frequency.setValueAtTime(880, context.currentTime);
      scheduleAdzanPattern(alarm, context);
    } else {
      scheduleIqomahPattern(alarm, context);
    }

    alarm.stopTimer = setTimeout(() => {
      if (activeAlarm === alarm) {
        stopAlarm();
      }
    }, ALARM_MAX_DURATION_MS);
  } catch {
    if (activeAlarm) {
      stopAlarm();
    } else if (oscillator) {
      try {
        oscillator.stop();
      } catch {
        // Oscillator mungkin sudah berhenti saat proses pembersihan.
      }
      disconnectAudioNodes(oscillator, gain);
    } else if (gain) {
      disconnectAudioNodes(null, gain);
    }
    activeAlarm = null;
    warnAudioInactive();
  }
}

export function stopAlarm(): void {
  const alarm = activeAlarm;
  activeAlarm = null;

  if (!alarm) {
    return;
  }

  if (alarm.patternTimer !== null) {
    clearInterval(alarm.patternTimer);
    alarm.patternTimer = null;
  }

  if (alarm.stopTimer !== null) {
    clearTimeout(alarm.stopTimer);
    alarm.stopTimer = null;
  }

  try {
    const stopTime = alarm.context.currentTime + 0.02;
    alarm.gain.gain.cancelScheduledValues(alarm.context.currentTime);
    alarm.gain.gain.linearRampToValueAtTime(0, stopTime);
    alarm.oscillator.stop(stopTime);
  } catch {
    try {
      alarm.oscillator.stop();
    } catch {
      // Oscillator sudah berhenti atau tidak sempat dimulai.
    }
  }

  disconnectAudioNodes(alarm.oscillator, alarm.gain);
}

export function isAlarmPlaying(): boolean {
  return activeAlarm !== null;
}
