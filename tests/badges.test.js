import { describe, it, expect } from 'vitest';
import {
  BADGE_CATEGORIES,
  BADGES,
  getBadgeById,
  getBadgesByCategory,
  getEncouragementBadges,
} from '../src/data/badges.js';

describe('BADGE_CATEGORIES', () => {
  it('should have correct category keys', () => {
    expect(BADGE_CATEGORIES).toHaveProperty('ENCOURAGEMENT');
    expect(BADGE_CATEGORIES).toHaveProperty('MASTERY');
    expect(BADGE_CATEGORIES).toHaveProperty('MILESTONE');
  });

  it('should have correct category values', () => {
    expect(BADGE_CATEGORIES.ENCOURAGEMENT).toBe('encouragement');
    expect(BADGE_CATEGORIES.MASTERY).toBe('mastery');
    expect(BADGE_CATEGORIES.MILESTONE).toBe('milestone');
  });
});

describe('BADGES', () => {
  it('should contain 19 badge definitions', () => {
    expect(BADGES).toHaveLength(19);
  });

  it('should have required fields for each badge', () => {
    const requiredFields = [
      'id',
      'category',
      'nameES',
      'nameEN',
      'descriptionES',
      'descriptionEN',
      'icon',
      'criteria',
    ];

    BADGES.forEach((badge) => {
      requiredFields.forEach((field) => {
        expect(badge).toHaveProperty(field);
        expect(badge[field]).toBeDefined();
        expect(badge[field]).not.toBe('');
      });
    });
  });

  it('should have unique badge IDs', () => {
    const ids = BADGES.map((b) => b.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(BADGES.length);
  });

  it('should have valid category values for all badges', () => {
    const validCategories = Object.values(BADGE_CATEGORIES);

    BADGES.forEach((badge) => {
      expect(validCategories).toContain(badge.category);
    });
  });

  it('should have criteria object with type property for all badges', () => {
    BADGES.forEach((badge) => {
      expect(badge.criteria).toHaveProperty('type');
      expect(typeof badge.criteria.type).toBe('string');
      expect(badge.criteria.type).not.toBe('');
    });
  });

  it('should have correct distribution across categories', () => {
    const encouragementBadges = BADGES.filter(
      (b) => b.category === BADGE_CATEGORIES.ENCOURAGEMENT
    );
    const masteryBadges = BADGES.filter(
      (b) => b.category === BADGE_CATEGORIES.MASTERY
    );
    const milestoneBadges = BADGES.filter(
      (b) => b.category === BADGE_CATEGORIES.MILESTONE
    );

    expect(encouragementBadges).toHaveLength(3);
    expect(masteryBadges).toHaveLength(13);
    expect(milestoneBadges).toHaveLength(3);
  });
});

describe('getBadgeById', () => {
  it('should return correct badge for valid encouragement badge ID', () => {
    const badge = getBadgeById('never-give-up');

    expect(badge).toBeDefined();
    expect(badge).not.toBeNull();
    expect(badge.id).toBe('never-give-up');
    expect(badge.category).toBe(BADGE_CATEGORIES.ENCOURAGEMENT);
    expect(badge.nameEN).toBe("I won't give up!");
  });

  it('should return correct badge for valid mastery badge ID', () => {
    const badge = getBadgeById('perfect-score');

    expect(badge).toBeDefined();
    expect(badge).not.toBeNull();
    expect(badge.id).toBe('perfect-score');
    expect(badge.category).toBe(BADGE_CATEGORIES.MASTERY);
    expect(badge.icon).toBe('⭐');
  });

  it('should return correct badge for valid milestone badge ID', () => {
    const badge = getBadgeById('first-steps');

    expect(badge).toBeDefined();
    expect(badge).not.toBeNull();
    expect(badge.id).toBe('first-steps');
    expect(badge.category).toBe(BADGE_CATEGORIES.MILESTONE);
    expect(badge.nameES).toBe('Primeros Pasos');
  });

  it('should return correct badge for sound master badge ID', () => {
    const badge = getBadgeById('sound-master-aa');

    expect(badge).toBeDefined();
    expect(badge).not.toBeNull();
    expect(badge.id).toBe('sound-master-aa');
    expect(badge.category).toBe(BADGE_CATEGORIES.MASTERY);
    expect(badge.criteria.type).toBe('sound_mastery');
    expect(badge.criteria.sound).toBe('aa');
  });

  it('should return null for invalid badge ID', () => {
    const badge = getBadgeById('non-existent-badge');
    expect(badge).toBeNull();
  });

  it('should return null for empty string ID', () => {
    const badge = getBadgeById('');
    expect(badge).toBeNull();
  });
});

describe('getBadgesByCategory', () => {
  it('should return 3 encouragement badges', () => {
    const badges = getBadgesByCategory(BADGE_CATEGORIES.ENCOURAGEMENT);

    expect(badges).toHaveLength(3);
    expect(badges.every((b) => b.category === BADGE_CATEGORIES.ENCOURAGEMENT)).toBe(true);

    const ids = badges.map((b) => b.id);
    expect(ids).toContain('never-give-up');
    expect(ids).toContain('practice-master');
    expect(ids).toContain('perseverance');
  });

  it('should return 13 mastery badges', () => {
    const badges = getBadgesByCategory(BADGE_CATEGORIES.MASTERY);

    expect(badges).toHaveLength(13);
    expect(badges.every((b) => b.category === BADGE_CATEGORIES.MASTERY)).toBe(true);

    const ids = badges.map((b) => b.id);
    expect(ids).toContain('perfect-score');
    expect(ids).toContain('sound-master-aa');
    expect(ids).toContain('sound-master-ee');
    expect(ids).toContain('sound-master-oo');
    expect(ids).toContain('sound-master-uu');
    expect(ids).toContain('sound-master-oe');
    expect(ids).toContain('sound-master-ie');
    expect(ids).toContain('sound-master-ei');
    expect(ids).toContain('sound-master-ij');
    expect(ids).toContain('sound-master-ou');
    expect(ids).toContain('sound-master-au');
    expect(ids).toContain('sound-master-eu');
    expect(ids).toContain('sound-master-ui');
  });

  it('should return 3 milestone badges', () => {
    const badges = getBadgesByCategory(BADGE_CATEGORIES.MILESTONE);

    expect(badges).toHaveLength(3);
    expect(badges.every((b) => b.category === BADGE_CATEGORIES.MILESTONE)).toBe(true);

    const ids = badges.map((b) => b.id);
    expect(ids).toContain('first-steps');
    expect(ids).toContain('level-1-complete');
    expect(ids).toContain('level-2-complete');
  });

  it('should return empty array for invalid category', () => {
    const badges = getBadgesByCategory('non-existent-category');
    expect(badges).toEqual([]);
  });

  it('should return empty array for empty string category', () => {
    const badges = getBadgesByCategory('');
    expect(badges).toEqual([]);
  });
});

describe('getEncouragementBadges', () => {
  it('should return 3 encouragement badges', () => {
    const badges = getEncouragementBadges();

    expect(badges).toHaveLength(3);
    expect(badges.every((b) => b.category === BADGE_CATEGORIES.ENCOURAGEMENT)).toBe(true);
  });

  it('should return same result as getBadgesByCategory for encouragement', () => {
    const directCall = getBadgesByCategory(BADGE_CATEGORIES.ENCOURAGEMENT);
    const helperCall = getEncouragementBadges();

    expect(helperCall).toEqual(directCall);
  });

  it('should include all expected encouragement badge IDs', () => {
    const badges = getEncouragementBadges();
    const ids = badges.map((b) => b.id);

    expect(ids).toContain('never-give-up');
    expect(ids).toContain('practice-master');
    expect(ids).toContain('perseverance');
  });
});
