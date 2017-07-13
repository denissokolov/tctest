// Usage example: node generateData.js 20

const fs = require('fs');

const fileData = fs.readFileSync('./public/data.json', 'utf8');
const data = JSON.parse(fileData);

const modifiedProjects = [...data.project];
const rootId = data.project[0].id;

const multiplier = parseInt(process.argv[2], 10) || 1;

let project;
for (let modifier = 0; modifier < multiplier; modifier += 1) {
  for (let i = 0; i < data.project.length; i += 1) {
    project = data.project[i];
    if (project.id !== rootId) {
      modifiedProjects.push({
        id: `${project.id}_#${modifier}`,
        name: `${project.name}_#${modifier}`,
        parentProject: {
          id: project.parentProject.id === rootId ? rootId : `${project.parentProject.id}_#${modifier}`,
        },
      });
    }
  }
}

const largeData = {
  count: modifiedProjects.length,
  href: data.href,
  project: modifiedProjects,
};

fs.writeFileSync(`./public/data-${largeData.count}.json`, JSON.stringify(largeData));
