const fs = require("fs");
const path = require("path");

// Obtener el tipo de incremento del argumento (patch, minor, major)
const incrementType = process.argv[2] || "patch";

try {
  const packagePath = path.resolve("package.json");
  const packageData = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  let version = packageData.version || "0.0.0";
  let parts = version.split(".").map(Number);

  // Incrementar según el tipo
  switch (incrementType) {
    case "major":
      parts[0]++;
      parts[1] = 0;
      parts[2] = 0;
      break;
    case "minor":
      parts[1]++;
      parts[2] = 0;
      break;
    case "patch":
    default:
      parts[2]++;
      break;
  }

  let newVersion = parts.join(".");
  packageData.version = newVersion;

  fs.writeFileSync(
    packagePath,
    JSON.stringify(packageData, null, 2) + "\n",
    "utf8"
  );
  console.log(`✅ Versión actualizada de ${version} a ${newVersion}`);
} catch (error) {
  console.error(`❌ Error: ${error.message}`);
  process.exit(1);
}
