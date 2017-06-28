import {
  generateKey,
  swapFirstUncommonLevelsInKeys,
  regenerateKeyFromParent,
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

  describe('swapFirstUncommonLevelsInKeys', () => {
    it('should return keys with swapped first uncommon levels', () => {
      expect(swapFirstUncommonLevelsInKeys({
        key1: '100022',
        key2: '289139',
      })).toEqual({
        key1: '289139',
        key2: '100022',
      });

      expect(swapFirstUncommonLevelsInKeys({
        key1: '121212/848900/901238/000101',
        key2: '121999/848900/901238/000101',
      })).toEqual({
        key1: '121999/848900/901238/000101',
        key2: '121212/848900/901238/000101',
      });

      expect(swapFirstUncommonLevelsInKeys({
        key1: '000000/000738',
        key2: '000000/001990',
      })).toEqual({
        key1: '000000/001990',
        key2: '000000/000738',
      });

      expect(swapFirstUncommonLevelsInKeys({
        key1: '000000/000000/000008',
        key2: '000000/000000/000009/000000',
      })).toEqual({
        key1: '000000/000000/000009',
        key2: '000000/000000/000008/000000',
      });

      expect(swapFirstUncommonLevelsInKeys({
        key1: '000000/000000/000008/000001',
        key2: '000000/000000/000009/000000',
      })).toEqual({
        key1: '000000/000000/000009/000001',
        key2: '000000/000000/000008/000000',
      });

      expect(swapFirstUncommonLevelsInKeys({
        key1: '100022/000000/213889',
        key2: '289139/000000',
      })).toEqual({
        key1: '289139/000000/213889',
        key2: '100022/000000',
      });

      expect(swapFirstUncommonLevelsInKeys({
        key1: '000000/000000',
        key2: '000000/000000/000000',
      })).toEqual({
        key1: '000000/000000',
        key2: '000000/000000/000000',
      });

      expect(swapFirstUncommonLevelsInKeys({
        key1: '129098/000000',
        key2: '129098/000000/213660',
      })).toEqual({
        key1: '129098/000000',
        key2: '129098/000000/213660',
      });
    });
  });

  describe('regenerateKeyFromParent', () => {
    it('should return key with first part from parent key', () => {
      const newKey = regenerateKeyFromParent('000000/000001/213660', '000000/000012');
      expect(newKey).toEqual('000000/000012/213660');
    });
  });
});
