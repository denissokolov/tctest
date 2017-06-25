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
  {
    id: 'Hibernate',
    name: 'Hibernate',
    parentProject: {
      id: 'OpenSourceProjects',
    },
    buildTypes: {
      count: 0,
      buildType: [],
    },
  },
  {
    id: 'Hibernate_HibernateOrm',
    name: 'Hibernate Orm',
    parentProject: {
      id: 'Hibernate',
    },
    buildTypes: {
      count: 1,
      buildType: [
        {
          id: 'Hibernate_HibernateOrm_Build',
          name: 'Build',
        },
      ],
    },
  },
  {
    id: 'OpenSourceProjects_ImplicitNullability',
    name: 'Implicit Nullability',
    parentProject: {
      id: 'OpenSourceProjects',
    },
  },
  {
    id: 'NUnit',
    name: 'NUnit',
    parentProject: {
      id: 'OpenSourceProjects',
    },
  },
  {
    id: 'NUnit_NUnit2',
    name: 'NUnit 2',
    parentProject: {
      id: 'NUnit',
    },
  },
  {
    id: 'NUnit_NUnit3',
    name: 'NUnit 3',
    parentProject: {
      id: 'NUnit',
    },
  },
  {
    id: 'NUnit_NUnit3_BuildAndTest',
    name: 'Build And Test',
    parentProject: {
      id: 'NUnit_NUnit3',
    },
  },
  {
    id: 'NUnit_NUnitLite',
    name: 'NUnitLite',
    parentProject: {
      id: 'NUnit',
    },
  },
  {
    id: 'NUnit_Sandbox',
    name: 'Sandbox',
    parentProject: {
      id: 'NUnit',
    },
  },
  {
    id: 'NUnit_Sandbox_MonoLinuxHang',
    name: 'Mono Linux Hang',
    parentProject: {
      id: 'NUnit_Sandbox',
    },
  },
  {
    id: 'cb_Root',
    name: 'teamcity.codebetter.com',
    parentProject: {
      id: '_Root',
    },
    buildTypes: {
      count: 0,
      buildType: [],
    },
  },
  {
    id: 'Nose',
    name: '#Nose',
    parentProject: {
      id: 'cb_Root',
    },
    buildTypes: {
      count: 1,
      buildType: [
        {
          id: 'bt409',
          name: '#Nose Trunk',
        },
      ],
    },
  },
  {
    id: 'Less',
    name: '.Less',
    parentProject: {
      id: 'cb_Root',
    },
    buildTypes: {
      count: 1,
      buildType: [
        {
          id: 'bt113',
          name: '.Less Trunk',
        },
      ],
    },
  },
];
