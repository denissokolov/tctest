export default [
  {
    id: '_Root',
    name: '<Root project>',
    buildTypes: {
      count: 0,
      buildType: [],
    },
  },
  {
    id: 'OpenSourceProjects',
    name: 'Open-source projects',
    parentProject: {
      id: '_Root',
    },
    buildTypes: {
      count: 0,
      buildType: [],
    },
  },
  {
    id: 'ApacheAnt',
    name: 'Apache Ant',
    parentProject: {
      id: 'OpenSourceProjects',
    },
    buildTypes: {
      count: 8,
      buildType: [
        {
          id: 'ApacheAnt_BuildAntUsingMave',
          name: 'Build Ant using Maven',
        },
        {
          id: 'bt132',
          name: 'Checkstyle',
        },
        {
          id: 'bt134',
          name: 'Core Trunk (Linux)',
        },
        {
          id: 'bt135',
          name: 'Core Trunk (MacOS)',
        },
        {
          id: 'bt133',
          name: 'Core Trunk (Windows)',
        },
        {
          id: 'bt130',
          name: 'Distribution',
        },
        {
          id: 'bt136',
          name: 'Findbugs',
        },
        {
          id: 'bt131',
          name: 'JavaDoc',
        },
      ],
    },
  },
];
