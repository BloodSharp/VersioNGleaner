const fs = require("fs");
var path = require("path");

function removeAngularVersionOnEveryFile(directorio, fakeVersion) {
  const files = fs.readdirSync(directorio);

  files.forEach((archivo) => {
    const fullPath = path.join(directorio, archivo);
    const routeStatus = fs.statSync(fullPath);

    if (routeStatus.isDirectory()) {
      removeAngularVersionOnEveryFile(fullPath);
    } else if (fullPath.endsWith(".js") || fullPath.endsWith(".html")) {
      let fileContent = fs.readFileSync(fullPath, "utf8");
      /*
      Expresión regular que corresponde al tag "app-root" del html:
      /ng-version=["']\d+\.\d+\.\d+["']/g
      
      Explicación:
      ng-version: busca el texto “ng-version”.
      ["']: busca una comilla simple (') o doble (").
      \d+\.\d+\.\d+: busca tres números separados por puntos.
      ["']: busca una comilla simple (') o doble (") que cierra la versión.
      /g: hace que la búsqueda sea global en todo el texto.
      */
      fileContent = fileContent.replaceAll(
        /ng-version=["']\d+\.\d+\.\d+["']/g,
        `ng-version="${fakeVersion}"`
      );
      /*
      Expresión regular que corresponde a algunas de las funciones de JavaScript que están dentro de los chunks:
      
      /\["ng-version",\s*"\d+\.\d+\.\d+"\]/g
      Explicación:
      \[ y \]: Coinciden con los caracteres “[” y “]” respectivamente.
      "ng-version": Coincide con el texto “ng-version”.
      ,: Coincide con una coma.
      \s*: Coincide con cualquier cantidad de espacios en blanco (incluyendo ninguno).
      "\d+\.\d+\.\d+": Coincide con una cadena que contiene tres números separados por puntos. \d+ coincide con uno o más dígitos, y \. coincide con un punto.
      /g: Es una bandera que indica que la búsqueda debe ser global, es decir, debe encontrar todas las coincidencias en lugar de detenerse después de la primera.
      */
      fileContent = fileContent.replaceAll(
        /\["ng-version",\s*"\d+\.\d+\.\d+"\]/g,
        `["ng-version","${fakeVersion}"]`
      );
      fs.writeFileSync(fullPath, fileContent);
      //console.log(`File: ${fullPath}\n`); //fileContent: ${fileContent}\n`);
    }
  });
}

removeAngularVersionOnEveryFile(
  path.resolve(__dirname, "../source/dist/"),
  "h4ck3rm4n - 1337"
);
