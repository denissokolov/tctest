import ProjectsStorage from './ProjectsStorage';

import serverProjects from '../__mocks__/serverProjects';

describe('ProjectsStorage', () => {
  describe('constructor', () => {
    it('getVisible should return all formatted items', () => {
      const storage = new ProjectsStorage(serverProjects);
      expect(storage.getVisible().length).toEqual(serverProjects.length);
    });

    it('getHidden should return empty array', () => {
      const storage = new ProjectsStorage(serverProjects);
      expect(storage.getHidden().length).toEqual(0);
    });
  });

  it('hideItems should change project visible property to false', () => {
    const storage = new ProjectsStorage(serverProjects);

    expect(storage.getHidden().length).toEqual(0);

    const ids = serverProjects.map(project => project.id);
    storage.hideItems(ids);

    expect(storage.getHidden().length).toEqual(serverProjects.length);
  });

  describe('filterHidden', () => {
    it('should return matches for one word', () => {
      const storage = new ProjectsStorage(serverProjects);
      storage.hideItems(serverProjects.map(project => project.id));

      storage.filterHidden('nu');

      const filterMatchIds = [
        'OpenSourceProjects_ImplicitNullability', 'NUnit', 'NUnit_NUnit2', 'NUnit_NUnit3',
        'NUnit_NUnitLite', 'NUnit_Sandbox_MonoLinuxHang',
      ];

      const childFilterMatchIds = ['_Root', 'OpenSourceProjects', 'NUnit', 'NUnit_Sandbox'];

      const parentFilterMatchIds = [
        'NUnit_NUnit2', 'NUnit_NUnit3', 'NUnit_NUnit3_BuildAndTest', 'NUnit_NUnitLite',
        'NUnit_Sandbox', 'NUnit_Sandbox_MonoLinuxHang',
      ];

      storage.getHidden().forEach((project) => {
        if (filterMatchIds.indexOf(project.id) !== -1) {
          expect(project.filterMatch).toBeTruthy();
        }

        if (childFilterMatchIds.indexOf(project.id) !== -1) {
          expect(project.childFilterMatch).toBeTruthy();
        }

        if (parentFilterMatchIds.indexOf(project.id) !== -1) {
          expect(project.parentFilterMatch).toBeTruthy();
        }
      });
    });
  });
});
