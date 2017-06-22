import { generateKey, getParentKeyFromKey, getAllParentsKeysFromKey } from './keyUtils';

describe('keyUtils', () => {
  describe('generateKey', () => {
    it('should create simple key for root', () => {
      expect(generateKey(0)).toEqual('000000');
      expect(generateKey(6)).toEqual('000006');
      expect(generateKey(101)).toEqual('000101');
    });

    it('should create key for child', () => {
      expect(generateKey(0, '000000')).toEqual('000000/000000');
      expect(generateKey(6, '000000/000666')).toEqual('000000/000666/000006');
      expect(generateKey(101, '121212/848900/901238')).toEqual('121212/848900/901238/000101');
    });
  });

  describe('getParentKeyFromKey', () => {
    it('should return empty array for root key', () => {
      expect(getParentKeyFromKey('234669')).toBeNull();
      expect(getParentKeyFromKey('000000')).toBeNull();
    });

    it('should return array of keys for child key', () => {
      expect(getParentKeyFromKey('000000/000000')).toEqual('000000');

      expect(getParentKeyFromKey('000000/000666/000006')).toEqual('000000/000666');

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

      expect(getAllParentsKeysFromKey('000000/000666/000006')).toEqual([
        '000000',
        '000000/000666',
      ]);

      expect(getAllParentsKeysFromKey('121212/848900/901238/000101')).toEqual([
        '121212',
        '121212/848900',
        '121212/848900/901238',
      ]);
    });
  });
});
