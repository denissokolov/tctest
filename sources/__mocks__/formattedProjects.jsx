export default [
  {
    id: '_Root',
    name: '<Root project>',
    depth: 0,
    filterTreeMatch: true,
  },
  {
    id: 'OpenSourceProjects',
    name: 'Open-source projects',
    depth: 1,
    parentId: '_Root',
    filterTreeMatch: true,
  },
  {
    id: 'ApacheAnt',
    name: 'Apache Ant',
    depth: 2,
    parentId: 'OpenSourceProjects',
  },
  {
    id: 'Hibernate',
    name: 'Hibernate',
    depth: 2,
    parentId: 'OpenSourceProjects',
    filterTreeMatch: true,
  },
  {
    id: 'Hibernate_HibernateOrm',
    name: 'Hibernate Orm',
    depth: 3,
    parentId: 'Hibernate',
    filterMatch: true,
  },
  {
    id: 'cb_Root',
    name: 'teamcity.codebetter.com',
    depth: 1,
    parentId: '_Root',
  },
  {
    id: 'Nose',
    name: '#Nose',
    depth: 2,
    parentId: 'cb_Root',
  },
  {
    id: 'Less',
    name: '.Less',
    depth: 2,
    parentId: 'cb_Root',
  },
];
