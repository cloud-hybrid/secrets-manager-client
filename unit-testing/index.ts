// import Path from "path";
const Path = require("path");
// import Process from "process";
const Process = require("process");
// import Subprocess from "child_process";
const Subprocess = require("child_process");

const CWD = Process.cwd();

/// Process.chdir(Path.dirname(Path.join(import.meta.url.replace("file://", ""), "..")));
Process.chdir(Path.dirname(__dirname));

Subprocess.execSync(["node", "--experimental-vm-modules", "$(command -v jest)", "--coverage", "--passWithNoTests", "--config", Process.cwd() + Path.sep + "jest.config.js"].join(" "), { stdio: "inherit" });

Process.chdir(CWD);

Process.exit(0);
