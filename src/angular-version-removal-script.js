const fs = require("fs");
var path = require("path");

/**
 * Removes the Angular's version on each file which ends with **_.html_** and **_.js_** extension at the specified directory path recursively.
 * @param {String} directoryPath The base directory path which contains the Angular files built using the ng command line utility.
 * @param {String} fakeVersion A fake version to replace the existing actual version.
 * @param {Boolean} shouldAvoidShowcasingAngularVersionInformation If it's true, then strip the **_ng-version_** information, otherwise
 * the **_ng-version_** information will be replaced using the **_fakeVersion_** information from the previous parameter.
 */
function removeAngularVersionOnEveryFile(
  directoryPath,
  fakeVersion,
  shouldAvoidShowcasingAngularVersionInformation
) {
  const files = fs.readdirSync(directoryPath);

  files.forEach((fileName) => {
    const fullPath = path.join(directoryPath, fileName);
    const routeStatus = fs.statSync(fullPath);

    if (routeStatus.isDirectory()) {
      removeAngularVersionOnEveryFile(fullPath);
    } else if (
      fullPath.toLowerCase().endsWith(".js") ||
      fullPath.toLowerCase().endsWith(".html")
    ) {
      let fileContent = fs.readFileSync(fullPath, "utf8");
      /*
      Regular expression matching the "app-root" tag from html files:
      /ng-version=["']\d+\.\d+\.\d+["']/g
      
      Explanation:
      ng-version: Search the text “ng-version”.
      ["']: Find either a single (') or double quote o doble (").
      \d+\.\d+\.\d+: Find 3 numbers split by dots.
      ["']: Find either a single (') or double quote o doble (") which closes the version.
      /g: Specifies the search should be global at the whole file.
      */
      if (shouldAvoidShowcasingAngularVersionInformation) {
        fileContent = fileContent.replaceAll(
          /ng-version=["']\d+\.\d+\.\d+["']/g,
          ""
        );
      } else {
        fileContent = fileContent.replaceAll(
          /ng-version=["']\d+\.\d+\.\d+["']/g,
          `ng-version="${fakeVersion}"`
        );
      }
      /*
      Regular expression matching some inside JavaScript functions within the chunks files:
      
      /\["ng-version",\s*"\d+\.\d+\.\d+"\]/g
      Explanation:
      \[ y \]: Matches all information between the characters “[” and “]”.
      "ng-version": Search the text “ng-version”.
      ,: Finds a comma.
      \s*: Matches any blank spaces.
      "\d+\.\d+\.\d+": Finds a string which contains 3 numbers (1 or more digits) split by dots.
      /g: Specifies the search should be global at the whole file.
      */
      if (shouldAvoidShowcasingAngularVersionInformation) {
        fileContent = fileContent.replaceAll(
          /\["ng-version",\s*"\d+\.\d+\.\d+"\]/g,
          `["",""]`
        );
      } else {
        fileContent = fileContent.replaceAll(
          /\["ng-version",\s*"\d+\.\d+\.\d+"\]/g,
          `["ng-version","${fakeVersion}"]`
        );
      }
      fs.writeFileSync(fullPath, fileContent);
      //console.log(`File: ${fullPath}\n`); //fileContent: ${fileContent}\n`);
    }
  });
}

removeAngularVersionOnEveryFile(
  path.resolve(__dirname, "../source/dist/"),
  "h4ck3rm4n - 1337",
  true
);
