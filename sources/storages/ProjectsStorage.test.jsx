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

  describe('swapWithPreviousVisibleProject', () => {
    it('should do nothing if prevProject does not exist', () => {
      const storage = new ProjectsStorage();
      storage.fillFromServerData(serverProjects);

      const openSourceProjects = storage.getVisible()[1];
      const rootProject = storage.getVisible()[0];
      storage.swapWithPreviousVisibleProject(openSourceProjects, 0);

      expect(storage.getVisible()[0].customSort).toBeFalsy();
      expect(storage.getVisible()[0]).toEqual(rootProject);
      expect(storage.getVisible()[1]).toEqual(openSourceProjects);
    });

    it('should swap projects if prevProject is exist', () => {
      const storage = new ProjectsStorage();
      storage.fillFromServerData(serverProjects);

      const hibernateProject = storage.getVisible()[3];
      const apacheAntProject = storage.getVisible()[2];
      storage.swapWithPreviousVisibleProject(hibernateProject, 2);

      expect(storage.getVisible()[1].customSort).toBeTruthy();
      expect(storage.getVisible()[2]).toEqual(hibernateProject);
      expect(storage.getVisible()[3]).toEqual(apacheAntProject);
    });

    it('should swap target project with prevProject with all children', () => {
      const storage = new ProjectsStorage();
      storage.fillFromServerData(serverProjects);

      const implicitNullabilityProject = storage.getVisible()[5];
      const hibernateProject = storage.getVisible()[3];
      const hibernateOrmProject = storage.getVisible()[4];
      storage.swapWithPreviousVisibleProject(implicitNullabilityProject, 4);

      expect(storage.getVisible()[1].customSort).toBeTruthy();
      expect(storage.getVisible()[3]).toEqual(implicitNullabilityProject);
      expect(storage.getVisible()[4]).toEqual(hibernateProject);
      expect(storage.getVisible()[5]).toEqual(hibernateOrmProject);
    });
  });

  it('recalculateVisibleSortKeys should update visible projects', () => {
    const storage = new ProjectsStorage();
    storage.visible = [{
      id: '_Root',
      name: '<Root project>',
      sortKey: '000001',
      customSort: true,
    }, {
      id: 'OpenSourceProjects',
      name: 'Open-source projects',
      sortKey: '000001/000003',
      visibleParentId: '_Root',
    }, {
      id: 'cb_Root',
      name: 'teamcity.codebetter.com',
      sortKey: '000001/000004',
      visibleParentId: '_Root',
    }, {
      id: 'Hibernate',
      name: 'Hibernate',
      sortKey: '000001/000004/123123',
      visibleParentId: 'cb_Root',
    }];

    storage.projects.set(storage.visible[0].id, storage.visible[0]);
    storage.projects.set(storage.visible[1].id, storage.visible[1]);
    storage.projects.set(storage.visible[2].id, storage.visible[2]);
    storage.projects.set(storage.visible[3].id, storage.visible[3]);

    storage.recalculateVisibleSortKeys();

    expect(storage.getVisible()).toEqual([{
      id: '_Root',
      name: '<Root project>',
      sortKey: '000001',
      customSort: true,
      sorted: false,
      visibleChildrenCount: 2,
    }, {
      id: 'OpenSourceProjects',
      name: 'Open-source projects',
      sortKey: '000001/000000',
      sorted: false,
      visibleChildrenCount: 0,
      visibleParentId: '_Root',
      parentCustomSort: true,
    }, {
      id: 'cb_Root',
      name: 'teamcity.codebetter.com',
      sortKey: '000001/000001',
      sorted: false,
      visibleChildrenCount: 1,
      visibleParentId: '_Root',
      parentCustomSort: true,
    }, {
      id: 'Hibernate',
      name: 'Hibernate',
      sorted: false,
      visibleChildrenCount: 0,
      sortKey: '000001/000001/123123',
      visibleParentId: 'cb_Root',
    }]);
  });

  it('refreshHiddenSort', () => {
    const storage = new ProjectsStorage();
    storage.hidden = [{
      id: 'cb_Root',
      name: 'teamcity.codebetter.com',
      sortKey: '000000/000001/000001',
    }, {
      id: 'OpenSourceProjects',
      name: 'Open-source projects',
      sortKey: '000000/000001/000000',
    }, {
      id: 'Hibernate_HibernateOrm',
      name: 'Open-source projects',
      sortKey: '000000/000001/000000/123123',
    }];

    storage.refreshHiddenSort();

    expect(storage.getHidden()).toEqual([{
      id: 'OpenSourceProjects',
      name: 'Open-source projects',
      sortKey: '000000/000001/000000',
    }, {
      id: 'Hibernate_HibernateOrm',
      name: 'Open-source projects',
      sortKey: '000000/000001/000000/123123',
    }, {
      id: 'cb_Root',
      name: 'teamcity.codebetter.com',
      sortKey: '000000/000001/000001',
    }]);
  });

  it('refreshVisibleSort', () => {
    const storage = new ProjectsStorage();
    storage.visible = [{
      id: 'cb_Root',
      name: 'teamcity.codebetter.com',
      sortKey: '000000/000001/000001',
    }, {
      id: 'OpenSourceProjects',
      name: 'Open-source projects',
      sortKey: '000000/000001/000000',
    }, {
      id: 'Hibernate_HibernateOrm',
      name: 'Open-source projects',
      sortKey: '000000/000001/000000/123123',
    }];

    storage.refreshVisibleSort();

    expect(storage.getVisible()).toEqual([{
      id: 'OpenSourceProjects',
      name: 'Open-source projects',
      sortKey: '000000/000001/000000',
    }, {
      id: 'Hibernate_HibernateOrm',
      name: 'Open-source projects',
      sortKey: '000000/000001/000000/123123',
    }, {
      id: 'cb_Root',
      name: 'teamcity.codebetter.com',
      sortKey: '000000/000001/000001',
    }]);
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

    it('should clear filter if value is empty', () => {
      const storage = new ProjectsStorage();
      storage.fillFromServerData(serverProjects);
      storage.hideItems(serverProjects.map(project => project.id));

      storage.filterHidden('nu');

      storage.filterHidden(' ');

      const hidden = storage.getHidden();
      const filterMatches = hidden.filter(project => project.filterMatch);
      const filterTreeMatches = hidden.filter(project => project.filterTreeMatch);

      expect(filterMatches.length).toBe(0);
      expect(filterTreeMatches.length).toBe(0);
    });

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
