import { createReadStream } from "fs";
import {
  SpeechConfig,
  AudioConfig,
  SpeechRecognizer,
  ResultReason,
  CancellationDetails,
  SpeechRecognitionResult,
  AudioInputStream,
  CancellationReason,
} from "microsoft-cognitiveservices-speech-sdk";
import { debug } from "./logger.js";

export class AzureSpeechServiceClient {
  #speechConfig;

  constructor(subscriptionKey, region) {
    this.#speechConfig = SpeechConfig.fromSubscription(subscriptionKey, region);
  }

  /**
   * Transcribes a file in real-time
   * @param {string} wavFilePath
   * @param {string} language
   * @param {((text: string) => void) | undefined} onRecognitionCallback
   */
  transcribeFileContinuous(wavFilePath, language, onRecognitionCallback) {
    this.#speechConfig.speechRecognitionLanguage = language;
    const client = new SpeechRecognizer(
      this.#speechConfig,
      this.#getFileStreamConfig(wavFilePath)
    );
    return this.#promisifyContinuousRecognition(client, onRecognitionCallback);
  }

  /**
   * Transcribes the microphone in real-time
   * @param {string} language
   * @param {((text: string) => void) | undefined} onRecognitionCallback
   * @returns
   */
  transcribeMic(language, onRecognitionCallback) {
    this.#speechConfig.speechRecognitionLanguage = language;
    const audioConfig = AudioConfig.fromMicrophoneInput();
    const client = new SpeechRecognizer(this.#speechConfig, audioConfig);
    return this.#promisifyContinuousRecognition(client, onRecognitionCallback);
  }

  /**
   * Transcribes a file in one go
   * @param {string} wavFilePath
   * @param {string} language
   * @returns {Promise<SpeechRecognitionResult>}
   */
  transcribeFileOnce(wavFilePath, language) {
    this.#speechConfig.speechRecognitionLanguage = language;
    const client = new SpeechRecognizer(
      this.#speechConfig,
      this.#getFileStreamConfig(wavFilePath)
    );
    return this.#promisifyRecognizeOnce(client);
  }

  #promisifyRecognizeOnce(client) {
    return new Promise((resolve, reject) => {
      client.recognizeOnceAsync((result) => {
        switch (result.reason) {
          case ResultReason.RecognizedSpeech:
            resolve(result);
            break;
          case ResultReason.NoMatch:
            reject(new Error("NOMATCH: Speech could not be recognized."));
            break;
          case ResultReason.Canceled:
            reject(CancellationDetails.fromResult(result));
            break;
          default:
            debug("Result reason=" + result.reason);
            break;
        }
      });
    }).finally(() => client.close());
  }

  #getFileStreamConfig(wavFilePath) {
    const inputStream = AudioInputStream.createPushStream();
    debug(wavFilePath);
    createReadStream(wavFilePath)
      .on("data", (d) => inputStream.write(d))
      .on("close", () => {
        inputStream.close();
      });

    return AudioConfig.fromStreamInput(inputStream);
    // This also exists: AudioConfig.fromWavFileInput(filepath)
  }

  /**
   *
   * @param {SpeechRecognizer} client
   * @param {(text: String) => void} onRecognitionCallback
   * @returns {Promise<string>}
   */
  #promisifyContinuousRecognition(
    client,
    onRecognitionCallback = (text) => {}
  ) {
    let accumulator = [];
    return new Promise((resolve, reject) => {
      client.recognizing = (_, event) => {
        debug("RECOGNIZING: Text=" + event.result.text);
      };

      client.recognized = (_, event) => {
        if (event.result.reason == ResultReason.RecognizedSpeech) {
          debug(`RECOGNIZED: Text=${event.result.text}`);
          onRecognitionCallback(event.result.text);
          accumulator.push(event.result.text);
        } else if (event.result.reason == ResultReason.NoMatch) {
          debug("NOMATCH: Speech could not be recognized.");
          accumulator.push("???");
        } else {
          debug("Unhandled result reason=" + event.result.reason);
        }
      };

      client.canceled = (_, event) => {
        if (event.reason == CancellationReason.Error) {
          debug(`"CANCELED: ErrorCode=${event.errorCode}`);
          debug(`"CANCELED: ErrorDetails=${event.errorDetails}`);
          debug(
            "CANCELED: Did you set the speech resource key and region values?"
          );
          reject(new Error(event.errorDetails));
        } else {
          debug("Completed: end of stream");
          resolve(accumulator.join("\n"));
        }
      };

      client.startContinuousRecognitionAsync();
    }).finally(() => client.stopContinuousRecognitionAsync());
  }
}
