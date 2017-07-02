import { fromJS } from 'immutable';

import { getSelectedIdsWithChildren, getSelectedIds } from './projectSelectUtils';

describe('projectSelectUtils', () => {
  describe('getSelectedIds', () => {
    it('should return empty array if no one option selected', () => {
      const options = [{
        value: 1,
      }, {
        value: 2,
      }, {
        value: 3,
      }, {
        value: 4,
      }, {
        value: 5,
      }, {
        value: 6,
      }, {
        value: 7,
      }];

      expect(getSelectedIds(options)).toEqual([]);
    });

    it('should return ids for selected options', () => {
      const options = [{
        value: 1,
        selected: true,
      }, {
        value: 2,
      }, {
        value: 3,
      }, {
        value: 4,
      }, {
        value: 5,
        selected: true,
      }, {
        value: 6,
      }, {
        value: 7,
      }];

      expect(getSelectedIds(options)).toEqual([1, 5]);
    });
  });

  describe('getSelectedIdsWithChildren', () => {
    it('should return ids for selected options with no selected child options', () => {
      const options = [{
        value: 1,
        selected: true,
      }, {
        value: 2,
      }, {
        value: 3,
      }, {
        value: 4,
      }, {
        value: 5,
        selected: true,
      }, {
        value: 6,
        selected: true,
      }, {
        value: 7,
      }];

      const projects = fromJS([{
        id: 1,
      }, {
        id: 2,
        parentId: 1,
      }, {
        id: 3,
        parentId: 1,
      }, {
        id: 4,
      }, {
        id: 5,
      }, {
        id: 6,
        parentId: 5,
      }, {
        id: 7,
        parentId: 5,
      }]);

      expect(getSelectedIdsWithChildren(options, projects, 'parentId')).toEqual([1, 2, 3, 5, 6]);
    });
  });
});
