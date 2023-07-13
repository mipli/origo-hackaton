#!/usr/bin/env node
import "./config.js";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { transcribeFile, transcribeMic } from "./functions.js";

// Parse arguments
yargs(hideBin(process.argv))
  .option("language", {
    description: "the language spoken in the input file",
    alias: "l",
    type: "string",
    default: "nb-NO",
  })
  .option("verbose", {
    alias: "v",
    boolean: true,
    default: false,
  })
  .option("output", {
    alias: "O",
    describe: "path to the output file",
    default: undefined,
    type: "string",
  })
  .command(
    "file",
    "transcribe a file",
    (yargs) =>
      yargs.option("input", {
        alias: "I",
        describe: "path to file",
        type: "string",
        demandOption: true,
      }),
    transcribeFile
  )
  .command(
    "mic",
    "transcribe input to the microphone in real-time",
    {},
    transcribeMic
  )
  .parse();
