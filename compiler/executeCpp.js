
// const { exec } = require("child_process");
// const fs = require("fs");
// const path = require("path");

// const outputPath = path.join(__dirname, "outputs");

// if (!fs.existsSync(outputPath)) {
//   fs.mkdirSync(outputPath, { recursive: true });
// }

// const executeCpp = (filepath, inputPath) => {
//   const jobId = path.basename(filepath).split(".")[0];
//   const outPath = path.join(outputPath, `${jobId}.out`);

//   return new Promise((resolve, reject) => {
//     exec(
//       `g++ "${filepath}" -o "${outPath}" && cd "${outputPath}" && ./${jobId}< ${inputPath}`,
//       (error, stdout, stderr) => {
//         if (error) {
//           console.log("here")
//           reject({ error, stderr , message:"yaha dikkat hai" });
//         }
//         if (stderr) {
//           console.log("hererer")
//           reject(stderr,"no yaha");
//         }
//         resolve(stdout);
//       }
//     );
//   });
// };

// module.exports = {
//   executeCpp,
// };



const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath, inputPath) => {
  console.log("hellllo")
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.exe`); // Use .exe extension for Windows

  return new Promise((resolve, reject) => {
    // Compilation command
    const compileCommand = `g++ "${filepath}" -o "${outPath}"`;

    exec(compileCommand, (compileError, compileStdout, compileStderr) => {
      if (compileError) {
        return reject({
          error: compileError,
          stderr: compileStderr,
          message: "Compilation failed",
        });
      }

      // If compilation is successful, run the executable
      const runCommand = `"${outPath}" < "${inputPath}"`;
      console.log("hererherherer")
      exec(runCommand, { cwd: outputPath }, (runError, runStdout, runStderr) => {
        console.log("hererherherer")
        if (runError) {
          return reject({
            error: runError,
            stderr: runStderr,
            message: "Execution failed",
          });
        }
        if (runStderr) {
          return reject(runStderr);
        }
        resolve(runStdout);
      });
    });
  });
};

module.exports = {
  executeCpp,
};
