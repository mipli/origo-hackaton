# node-js-audio-to-text

Programskall/eksempelkode for bruk av Azure sitt "Speech Services" API, spesifikt `audio-to-text`-funksjonaliteten.

For å kjøre må du logge deg inn på https://portal.azure.com og hente ned en key og et endpoint fra en passende Cognitive Services SpeechServices-ressurs som ligger i Norway East.

## Pre-requisites

- node (testet med 18.16.1)
- Azure subscription key (`SPEECH_SUBSCRIPTION_KEY` miljøvariabel)
- Azure speech service endpoint region (`SPEECH_ENDPOINT_REGION` miljøvariabel, `norwayeast` er antageligvis riktig)

## Kjøre applikasjonen

Kopier .env-eksempelfila og bytt ut verdiene:

```
cp .env.EXAMPLE .env
```

Så er det bare å bygge applikasjonen:

```
npm i
```

- oversett en fil

```
node transcribe file -I data/Test.wav
```

- oversett mikrofonen i real-time

```
node transcribe mic
```

## Usage

```
❯ node transcribe --help
transcribe [command]

Commands:
  transcribe file  transcribe a file
  transcribe mic   transcribe input to the microphone in real-time

Options:
      --help      Show help                                            [boolean]
      --version   Show version number                                  [boolean]
  -l, --language  the language spoken in the input file
                                                     [string] [default: "nb-NO"]
  -v, --verbose                                       [boolean] [default: false]
  -O, --output    path to the output file                               [string]
```

## Known issues

- `transcribe mic` fungerer ikke på min maskin, vet ikke om det bare er mitt oppsett eller om det er noe mangelfullt i koden
