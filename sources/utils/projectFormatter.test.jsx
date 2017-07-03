import { getUpdatedProjectProps } from './projectFormatter';

describe('projectFormatter', () => {
  describe('getUpdatedProjectProps', () => {
    it('should return empty object if parent does not exist', () => {
      const project = {
        id: '_Root',
        name: '<Root project>',
      };
      expect(getUpdatedProjectProps(project)).toEqual({});
    });

    it('should return object if parent is visible', () => {
      const project = {
        id: 'Hibernate',
        name: 'Hibernate',
        visible: true,
        depth: 2,
        parentId: 'OpenSourceProjects',
        visibleParentId: 'OpenSourceProjects',
        sortNumber: 3,
        original: {
          name: 'Hibernate',
          sortNumber: 3,
        },
      };

      const parent = {
        id: 'OpenSourceProjects',
        name: 'Open-source projects',
        visible: true,
        depth: 1,
        parentId: '_Root',
        visibleParentId: '_Root',
        customSort: false,
        sortKey: '000000/000000',
        original: {
          name: 'Open-source projects',
        },
      };

      expect(getUpdatedProjectProps(project, parent)).toEqual({
        name: project.name,
        depth: project.depth,
        visibleParentId: project.visibleParentId,
        parentCustomSort: parent.customSort,
        sortKey: '000000/000000/000003',
      });
    });
  });
});
