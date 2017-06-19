export default [
  {
    id: '_Root',
    name: '<Root project>',
    depth: 0,
  },
  {
    id: 'OpenSourceProjects',
    name: 'Open-source projects',
    depth: 1,
    parentProjectId: '_Root',
  },
  {
    id: 'ApacheAnt',
    name: 'Apache Ant',
    depth: 2,
    parentProjectId: 'OpenSourceProjects',
  },
  {
    id: 'Hibernate',
    name: 'Hibernate',
    depth: 2,
    parentProjectId: 'OpenSourceProjects',
  },
  {
    id: 'Hibernate_HibernateOrm',
    name: 'Hibernate Orm',
    depth: 3,
    parentProjectId: 'Hibernate',
  },
  {
    id: 'cb_Root',
    name: 'teamcity.codebetter.com',
    depth: 1,
    parentProjectId: '_Root',
  },
  {
    id: 'Nose',
    name: '#Nose',
    depth: 2,
    parentProjectId: 'cb_Root',
  },
  {
    id: 'Less',
    name: '.Less',
    depth: 2,
    parentProjectId: 'cb_Root',
  },
];
