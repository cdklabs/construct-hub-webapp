/*******************************************************************
 * Fetch jsii assembly files to the 'public/packages' directory.
 *
 * This script recuresively fetches assemblies so that a complete jsii type system
 * can be created for a given package. The assemblies are placed in the 'public/packages'
 * directory with the structure the webapp expects, so a development environment
 * will have transparent access to these assemblies.
 *
 * Environment variables:
 *
 *  - PACKAGE_NAME (Required) : The name of the package (e.g @aws-cdk/aws-ecr)
 *  - PACKAGE_VERSION (Required) : The version of the package (e.g 1.106.0)
 *
 * Example:
 *
 *   PACKAGE_NAME=@aws-cdk/aws-ecr PACKAGE_VERSION=1.106.0 node ./scripts/fetch-assemblies.js
 ****************************************************************************************************/

const exec = require("child_process").exec;
const fs = require("fs");
const os = require("os");
const path = require("path");

function fromEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name} env variable`);
  }
  return value;
}

function fetchAssembly(packageName, packageVersion, packagesPath) {

  if (packageVersion.startsWith("^")) {
    packageVersion = packageVersion.substring(1, packageVersion.length);
  }

  const output = `${packagesPath}/${packageName}/v${packageVersion}/assembly.json`;
  const assemblyPath = `${__dirname}/../${output}`;
  const package = `${packageName}@${packageVersion}`;

  if (fs.existsSync(assemblyPath)) {
    console.log(`Assembly for ${package} already exists locally`);
    return;
  }

  console.log(`Fetching assembly for ${package}`);

  const tempDir = fs.mkdtempSync(`${os.tmpdir()}/assembly`);
  const assemblyDir = path.dirname(assemblyPath);
  exec(
    `cd ${tempDir} && npm v ${package} dist.tarball | xargs curl | tar -xz`,
    (error, _, stderr) => {
      try {

        if (error) {
          console.log(`stderr: ${stderr}`);
          throw error
        }

        fs.mkdirSync(assemblyDir, { recursive: true });
        fs.copyFileSync(path.join(tempDir, "package", ".jsii"), assemblyPath);
        const packageJson = JSON.parse(
          fs.readFileSync(path.join(tempDir, "package", "package.json"))
        );
        for (const [n, v] of Object.entries(
          packageJson.peerDependencies ? packageJson.peerDependencies : {}
        )) {
          fetchAssembly(n, v, packagesPath);
        }
        exec(`rm -rf ${tempDir}`);
      } catch (e) {
        throw new Error(`Failed fetching assembly for ${package} (cwd: ${tempDir}): ${e.message}`)
      }
    }
  );
}

fetchAssembly(fromEnv('PACKAGE_NAME'), fromEnv('PACKAGE_VERSION'), 'public/data')