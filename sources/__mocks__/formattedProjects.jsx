export default [
  {
    id: '_Root',
    name: '<Root project>',
    depth: 0,
    filterTreeMatch: true,
    original: {},
  },
  {
    id: 'OpenSourceProjects',
    name: 'Open-source projects',
    depth: 1,
    parentId: '_Root',
    visibleParentId: '_Root',
    filterTreeMatch: true,
    original: {
      parentId: '_Root',
    },
  },
  {
    id: 'ApacheAnt',
    name: 'Apache Ant',
    depth: 2,
    parentId: 'OpenSourceProjects',
    visibleParentId: 'OpenSourceProjects',
    original: {
      parentId: 'OpenSourceProjects',
    },
  },
  {
    id: 'Hibernate',
    name: 'Hibernate',
    depth: 2,
    parentId: 'OpenSourceProjects',
    visibleParentId: 'OpenSourceProjects',
    filterTreeMatch: true,
    original: {
      parentId: 'OpenSourceProjects',
    },
  },
  {
    id: 'Hibernate_HibernateOrm',
    name: 'Hibernate Orm',
    depth: 3,
    parentId: 'Hibernate',
    visibleParentId: 'Hibernate',
    filterMatch: true,
    original: {
      parentId: 'Hibernate',
    },
  },
  {
    id: 'cb_Root',
    name: 'teamcity.codebetter.com',
    depth: 1,
    parentId: '_Root',
    visibleParentId: '_Root',
    original: {
      parentId: '_Root',
    },
  },
  {
    id: 'Nose',
    name: '#Nose',
    depth: 2,
    parentId: 'cb_Root',
    visibleParentId: 'cb_Root',
    original: {
      parentId: 'cb_Root',
    },
  },
  {
    id: 'Less',
    name: '.Less',
    depth: 2,
    parentId: 'cb_Root',
    visibleParentId: 'cb_Root',
    original: {
      parentId: 'cb_Root',
    },
  },
];
