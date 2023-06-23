import { AzureSpeechServiceClient } from "./AzureSpeechServiceClient.js";
import { writeFileSync } from "fs";

const speechClient = new AzureSpeechServiceClient(
  process.env.SPEECH_SUBSCRIPTION_KEY,
  process.env.SPEECH_ENDPOINT_REGION
);

export async function transcribeFile(argv) {
  process.env.verbose = argv.verbose;
  try {
    const result = await speechClient.transcribeFileContinuous(
      argv.input,
      argv.language,
      (text) => console.log("Recognized:", text)
    );
    if (argv.output) {
      writeFileSync(argv.output, result);
    }
    console.log(result);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

export async function transcribeMic(argv) {
  process.env.verbose = argv.verbose;
  try {
    const entireTranscript = await speechClient.transcribeMic(
      argv.language,
      (text) => console.log("Recognized:", text)
    );
    if (argv.output) {
      writeFileSync(argv.output, entireTranscript);
    }
    console.log("Entire transcript:", entireTranscript);
    console.log("Completed. Program will exit.");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
