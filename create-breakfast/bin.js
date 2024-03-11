#!/usr/bin/env node

import degit from "degit";
import { resolve } from "node:path";
import { intro, spinner, outro, cancel, text } from "@clack/prompts";

intro("Lets start making something yummy...");

const currentDirectory = process.cwd();
const directory = await text({
  message: "Where should we get cooking?",
  initialValue: "./breakfast-plugin",
  validate: (input) => {
    if (input.length < 1) return "Please enter a directory";
  },
});

const destination = resolve(
  directory.startsWith("/") ? "" : currentDirectory,
  directory
);

const { start, stop } = spinner();

start("Pulling in the template...");

try {
  const emitter = degit("github:sparklapse/breakfast-plugins/template", {
    force: true,
    verbose: true,
  });

  await emitter.clone(destination);
} catch (err) {
  cancel("Something went wrong, please try again.");
  console.error(err);
  process.exit(1);
}

stop("Clone complete!");

outro("You're ready to get cooking, Good luck!");
