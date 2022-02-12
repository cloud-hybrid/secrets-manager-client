#!/usr/bin/env node

import Path from "path";
import Process from "process";
import Subprocess from "child_process";

const CWD = Process.cwd();

Process.chdir(Path.dirname(Path.join(import.meta.url.replace("file://", ""), "..")));

Subprocess.execSync(["node", "--experimental-vm-modules", "$(command -v jest)", "--coverage", "--passWithNoTests", "--config", Process.cwd() + Path.sep + "jest.config.js"].join(" "), { stdio: "inherit" });

Process.chdir(CWD);

Process.exit(0);
