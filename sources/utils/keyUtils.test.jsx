import {
  generateKey,
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

  describe('regenerateKeyFromParent', () => {
    it('should return key with first part from parent key', () => {
      const newKey = regenerateKeyFromParent('000000/000001/213660', '000000/000012');
      expect(newKey).toEqual('000000/000012/213660');
    });
  });
});
