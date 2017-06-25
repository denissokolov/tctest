import {
  generateKey,
  getNextKeyOnSameLevel,
  getPrevKeyOnSameLevel,
  getParentKeyFromKey,
  getAllParentsKeysFromKey,
  getOneThirdOfMaxLevelPosition,
  getTwoThirdOfMaxLevelPosition,
} from './keyUtils';

describe('keyUtils', () => {
  describe('generateKey', () => {
    it('should create simple key for root', () => {
      expect(generateKey(0)).toEqual('000000');
      expect(generateKey(6)).toEqual('000006');
      expect(generateKey(101)).toEqual('000101');
    });

    it('should create key for child', () => {
      expect(generateKey(0, '000000')).toEqual('000000/000000');
      expect(generateKey(6, '000000/000738')).toEqual('000000/000738/000006');
      expect(generateKey(101, '121212/848900/901238')).toEqual('121212/848900/901238/000101');
    });

    it('should generate correct root key for undefined parentKey param', () => {
      expect(generateKey(0, undefined)).toEqual('000000');

      let un;
      expect(generateKey(6, un)).toEqual('000006');
    });
  });

  describe('getNextKeyOnSameLevel', () => {
    it('should return next root key', () => {
      expect(getNextKeyOnSameLevel('000000')).toEqual('000001');
      expect(getNextKeyOnSameLevel('003219')).toEqual('003220');
    });

    it('should return next child key on same level', () => {
      expect(getNextKeyOnSameLevel('000000/000738')).toEqual('000000/000739');
      expect(getNextKeyOnSameLevel('121212/848900/901238/000101')).toEqual('121212/848900/901238/000102');
    });
  });

  describe('getPrevKeyOnSameLevel', () => {
    it('should return prev root key', () => {
      expect(getPrevKeyOnSameLevel('000001')).toEqual('000000');
      expect(getPrevKeyOnSameLevel('003219')).toEqual('003218');
      expect(getPrevKeyOnSameLevel('000010')).toEqual('000009');
    });

    it('should return prev child key on same level', () => {
      expect(getPrevKeyOnSameLevel('000000/000738')).toEqual('000000/000737');
      expect(getPrevKeyOnSameLevel('121212/848900/901238/000101')).toEqual('121212/848900/901238/000100');
    });

    it('should return null for first key in current level', () => {
      expect(getPrevKeyOnSameLevel('000000')).toBeNull();
      expect(getPrevKeyOnSameLevel('121212/848900/901238/000000')).toBeNull();
    });
  });

  describe('getOneThirdOfMaxLevelPosition', () => {
    it('should return 333333', () => {
      expect(getOneThirdOfMaxLevelPosition()).toEqual(333333);
    });
  });

  describe('getTwoThirdOfMaxLevelPosition', () => {
    it('should return 666666', () => {
      expect(getTwoThirdOfMaxLevelPosition()).toEqual(666666);
    });
  });

  describe('getParentKeyFromKey', () => {
    it('should return empty array for root key', () => {
      expect(getParentKeyFromKey('234669')).toBeNull();
      expect(getParentKeyFromKey('000000')).toBeNull();
    });

    it('should return array of keys for child key', () => {
      expect(getParentKeyFromKey('000000/000000')).toEqual('000000');

      expect(getParentKeyFromKey('000000/000738/000006')).toEqual('000000/000738');

      expect(getParentKeyFromKey('121212/848900/901238/000101')).toEqual('121212/848900/901238');
    });
  });

  describe('getAllParentsKeysFromKey', () => {
    it('should return empty array for root key', () => {
      expect(getAllParentsKeysFromKey('234669')).toEqual([]);
      expect(getAllParentsKeysFromKey('000000')).toEqual([]);
    });

    it('should return array of keys for child key', () => {
      expect(getAllParentsKeysFromKey('000000/000000')).toEqual([
        '000000',
      ]);

      expect(getAllParentsKeysFromKey('000000/000738/000006')).toEqual([
        '000000',
        '000000/000738',
      ]);

      expect(getAllParentsKeysFromKey('121212/848900/901238/000101')).toEqual([
        '121212',
        '121212/848900',
        '121212/848900/901238',
      ]);
    });
  });
});
