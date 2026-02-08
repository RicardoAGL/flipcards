/**
 * TTS Utility Tests
 * Tests for text-to-speech voice selection and scoring
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createSpeechSynthesisMock } from './setup.js';

// Set up speech synthesis mock before imports
/** @type {any} */
let synthMock;

beforeEach(() => {
  synthMock = createSpeechSynthesisMock();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// Import tested module — functions are stateless so safe to import once
import {
  scoreVoice,
  getDutchVoices,
  isDutchVoiceAvailable,
  isSpeechSynthesisSupported,
} from '../src/lib/tts.js';

describe('TTS Utilities', () => {
  // ==========================================
  // scoreVoice
  // ==========================================
  describe('scoreVoice', () => {
    it('should score nl-NL higher than nl-BE', () => {
      const nlNL = /** @type {any} */ ({ lang: 'nl-NL', name: 'Voice', localService: true });
      const nlBE = /** @type {any} */ ({ lang: 'nl-BE', name: 'Voice', localService: true });

      expect(scoreVoice(nlNL)).toBeGreaterThan(scoreVoice(nlBE));
    });

    it('should score nl-BE higher than other nl variants', () => {
      const nlBE = /** @type {any} */ ({ lang: 'nl-BE', name: 'Voice', localService: true });
      const nlOther = /** @type {any} */ ({ lang: 'nl', name: 'Voice', localService: true });

      expect(scoreVoice(nlBE)).toBeGreaterThan(scoreVoice(nlOther));
    });

    it('should prefer cloud voices over local voices', () => {
      const cloud = /** @type {any} */ ({ lang: 'nl-NL', name: 'Voice', localService: false });
      const local = /** @type {any} */ ({ lang: 'nl-NL', name: 'Voice', localService: true });

      expect(scoreVoice(cloud)).toBeGreaterThan(scoreVoice(local));
    });

    it('should give bonus for named premium engines (Google, Microsoft, Apple)', () => {
      const google = /** @type {any} */ ({ lang: 'nl-NL', name: 'Google Dutch', localService: true });
      const generic = /** @type {any} */ ({ lang: 'nl-NL', name: 'Dutch Voice', localService: true });

      expect(scoreVoice(google)).toBeGreaterThan(scoreVoice(generic));

      const microsoft = /** @type {any} */ ({ lang: 'nl-NL', name: 'Microsoft Anna', localService: true });
      expect(scoreVoice(microsoft)).toBeGreaterThan(scoreVoice(generic));

      const apple = /** @type {any} */ ({ lang: 'nl-NL', name: 'Apple Xander', localService: true });
      expect(scoreVoice(apple)).toBeGreaterThan(scoreVoice(generic));
    });

    it('should rank cloud nl-NL Google voice highest', () => {
      const best = /** @type {any} */ ({ lang: 'nl-NL', name: 'Google Dutch', localService: false });
      const good = /** @type {any} */ ({ lang: 'nl-NL', name: 'Dutch Voice', localService: true });
      const ok = /** @type {any} */ ({ lang: 'nl-BE', name: 'Dutch Voice', localService: true });

      expect(scoreVoice(best)).toBeGreaterThan(scoreVoice(good));
      expect(scoreVoice(good)).toBeGreaterThan(scoreVoice(ok));
    });
  });

  // ==========================================
  // getDutchVoices
  // ==========================================
  describe('getDutchVoices', () => {
    it('should return Dutch voices sorted by score', async () => {
      synthMock.mockSynthesis.getVoices.mockReturnValue([
        { lang: 'en-US', name: 'English', localService: true },
        { lang: 'nl-BE', name: 'Belgian Dutch', localService: true },
        { lang: 'nl-NL', name: 'Dutch', localService: true },
        { lang: 'nl-NL', name: 'Google Dutch', localService: false },
      ]);

      const voices = await getDutchVoices();

      expect(voices).toHaveLength(3);
      // Cloud Google nl-NL should be first
      expect(voices[0].name).toBe('Google Dutch');
      // Local nl-NL should be second
      expect(voices[1].name).toBe('Dutch');
      // nl-BE should be last
      expect(voices[2].name).toBe('Belgian Dutch');
    });

    it('should filter out non-Dutch voices', async () => {
      synthMock.mockSynthesis.getVoices.mockReturnValue([
        { lang: 'en-US', name: 'English', localService: true },
        { lang: 'fr-FR', name: 'French', localService: true },
        { lang: 'nl-NL', name: 'Dutch', localService: true },
      ]);

      const voices = await getDutchVoices();

      expect(voices).toHaveLength(1);
      expect(voices[0].lang).toBe('nl-NL');
    });

    it('should resolve empty after timeout when no voices load', async () => {
      vi.useFakeTimers();

      // Empty initial voices, no onvoiceschanged ever fires
      synthMock.mockSynthesis.getVoices.mockReturnValue([]);

      const promise = getDutchVoices(100);

      vi.advanceTimersByTime(100);

      const voices = await promise;
      expect(voices).toEqual([]);

      vi.useRealTimers();
    });

    it('should resolve via onvoiceschanged when initial voices empty', async () => {
      // First call returns empty
      synthMock.mockSynthesis.getVoices
        .mockReturnValueOnce([])
        .mockReturnValueOnce([
          { lang: 'nl-NL', name: 'Dutch', localService: true },
        ]);

      const promise = getDutchVoices();

      // Trigger onvoiceschanged
      synthMock.mockSynthesis.onvoiceschanged();

      const voices = await promise;
      expect(voices).toHaveLength(1);
      expect(voices[0].lang).toBe('nl-NL');
    });
  });

  // ==========================================
  // isDutchVoiceAvailable
  // ==========================================
  describe('isDutchVoiceAvailable', () => {
    it('should return true when Dutch voices exist', async () => {
      synthMock.mockSynthesis.getVoices.mockReturnValue([
        { lang: 'nl-NL', name: 'Dutch', localService: true },
      ]);

      const available = await isDutchVoiceAvailable();
      expect(available).toBe(true);
    });

    it('should return false when no Dutch voices exist', async () => {
      synthMock.mockSynthesis.getVoices.mockReturnValue([
        { lang: 'en-US', name: 'English', localService: true },
      ]);

      const available = await isDutchVoiceAvailable();
      expect(available).toBe(false);
    });
  });

  // ==========================================
  // isSpeechSynthesisSupported
  // ==========================================
  describe('isSpeechSynthesisSupported', () => {
    it('should return true when speechSynthesis is available', () => {
      expect(isSpeechSynthesisSupported()).toBe(true);
    });
  });
});
