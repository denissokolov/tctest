import ProjectsStorage from './ProjectsStorage';

import serverProjects from '../__mocks__/serverProjects';

describe('ProjectsStorage', () => {
  describe('constructor', () => {
    it('getVisible should return all formatted items', () => {
      const storage = new ProjectsStorage();
      storage.fillFromServerData(serverProjects);
      expect(storage.getVisible().length).toEqual(serverProjects.length);
    });

    it('getHidden should return empty array', () => {
      const storage = new ProjectsStorage();
      storage.fillFromServerData(serverProjects);
      expect(storage.getHidden().length).toEqual(0);
    });
  });

  it('hideItems should change project visible property to false', () => {
    const storage = new ProjectsStorage();
    storage.fillFromServerData(serverProjects);

    expect(storage.getHidden().length).toEqual(0);

    const ids = serverProjects.map(project => project.id);
    storage.hideItems(ids);

    expect(storage.getHidden().length).toEqual(serverProjects.length - 1);
    expect(storage.getVisible().length).toEqual(1);
  });

  describe('filterHidden', () => {
    const checkProjectFilterParams = (storage, filterMatchNames, filterTreeMatchNames) => {
      storage.getHidden().forEach((project) => {
        if (filterMatchNames.indexOf(project.original.name) !== -1) {
          expect(project.filterMatch).toBeTruthy();
        } else {
          expect(project.filterMatch).toBeFalsy();
        }

        if (filterTreeMatchNames.indexOf(project.original.name) !== -1) {
          expect(project.filterTreeMatch).toBeTruthy();
        } else {
          expect(project.filterTreeMatch).toBeFalsy();
        }
      });
    };

    it('should return matches for one word', () => {
      const storage = new ProjectsStorage();
      storage.fillFromServerData(serverProjects);
      storage.hideItems(serverProjects.map(project => project.id));

      storage.filterHidden('nu');

      const filterMatchNames = [
        'Implicit Nullability', 'NUnit', 'NUnit 2', 'NUnit 3', 'NUnitLite', 'Mono Linux Hang',
      ];

      const filterTreeMatchNames = [
        '<Root project>', 'Open-source projects', 'Sandbox', 'Build And Test',
      ];

      checkProjectFilterParams(storage, filterMatchNames, filterTreeMatchNames);
    });

    it('should return matches for two words', () => {
      const storage = new ProjectsStorage();
      storage.fillFromServerData(serverProjects);
      storage.hideItems(serverProjects.map(project => project.id));

      storage.filterHidden('nu li');

      const filterMatchNames = [
        'Implicit Nullability', 'NUnit', 'Mono Linux Hang', 'NUnitLite',
      ];

      const filterTreeMatchNames = [
        '<Root project>', 'Open-source projects', 'Sandbox',
      ];

      checkProjectFilterParams(storage, filterMatchNames, filterTreeMatchNames);
    });
  });

  describe('clearFilter', () => {
    const storage = new ProjectsStorage();
    storage.fillFromServerData(serverProjects);
    storage.hideItems(serverProjects.map(project => project.id));
    storage.filterHidden('nu');

    storage.clearFilter();

    const hidden = storage.getHidden();
    const filterMatches = hidden.filter(project => project.filterMatch);
    const filterTreeMatches = hidden.filter(project => project.filterTreeMatch);

    expect(filterMatches.length).toBe(0);
    expect(filterTreeMatches.length).toBe(0);
  });
});
