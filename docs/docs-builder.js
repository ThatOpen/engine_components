const fs = require("fs");
const path = require("path");

const components = {};
const folderNames = ["dist", "core"];
const projectDir = __dirname.slice(0, __dirname.lastIndexOf("\\"));

// source: https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
const traverseDir = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach((file) => {
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          traverseDir(file, (err, res) => {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

const saveTutorialPaths = (error, result) => {
  if(error) {
    console.log(error);
    return;
  }

  // const filtered = result.filter(path => path.match(/index\.(html|d\.ts)$/) );
  const filteredHtml = result.filter(path => path.match(/index\.html$/) );


  for(const path of filteredHtml) {
    const splitted = path.split("\\");
    const name = splitted[splitted.length - 2];
    if(components[name]) {
      throw new Error(`Multiple components with the same name: ${name}`);
    }

    let deployedPath = path.replace(projectDir, "https://ifcjs.github.io/components");
    deployedPath = deployedPath.replaceAll("\\", "/");
    if(!folderNames.includes(name)) {
      components[name] = {
        tutorial: deployedPath
      }
    }
  }

  traverseDir("./dist", saveApiPaths);
}

const saveApiPaths = (error, result) => {

  const filteredAPIs = result.filter(path => path.match(/index\.d\.ts$/) );
  for(const path of filteredAPIs) {
    const splitted = path.split("\\");
    const name = splitted[splitted.length - 2];
    if(!components[name] && !folderNames.includes(name)) {
      components[name] = {};
    }
    let deployedPath = path.replace(projectDir, "https://raw.githubusercontent.com/IFCjs/components/main");
    deployedPath = deployedPath.replaceAll("\\", "/");
    if(!folderNames.includes(name)) {
      components[name].api = deployedPath;
    }
  }

  const componentList = [];
  for(const name in components) {
    const component = components[name];
    componentList.push({...component, name});
  }

  const serialized = JSON.stringify(componentList);
  fs.writeFileSync("./docs/docs.json", serialized);
}


traverseDir("./src", saveTutorialPaths);
