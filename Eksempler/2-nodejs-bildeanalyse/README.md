# Node.js -> Azure vision

Dette eksempelet sender et foto til Azure Cognitive Services Vision for analyse. I retur får du diverse metadata om bildet.

For å kjøre må du logge deg inn på https://portal.azure.com og hente ned en key og et endpoint fra en passende Cognitive Services ComputerVision-ressurs som ligger i North Europe (der har de den nyeste versjonen per juni 2023).

Kopier .env-eksempelfila og bytt ut verdiene:

```
cp .env.EXAMPLE .env
```

Så er det bare å kjøre appen:

```
npm i
node index.js
```

Fra dette bildet

![Rød rutebuss i gatemiljø](demo_image_photo_nikolai_kobets_freund.jpg) _Foto: Nikolai Kobets Freund / Oslo kommune_

burde du da få noe output a la:

```
{
  "modelVersion": "2023-02-01-preview",
  "metadata": {
    "width": 1333,
    "height": 2000
  },
  "tagsResult": {
    "values": [
      {
        "name": "utendørs",
        "confidence": 0.9991104602813721
      },
      {
        "name": "Landkjøretøy",
        "confidence": 0.9957456588745117
      },
      {
        "name": "kjøretøy",
        "confidence": 0.994348406791687
      },
      {
        "name": "tre",
        "confidence": 0.9918640851974487
      },
      {
        "name": "buss",
        "confidence": 0.9888671636581421
      },
      {
        "name": "vei",
        "confidence": 0.9846408367156982
      },
      ...
    ]
  }
}

```
