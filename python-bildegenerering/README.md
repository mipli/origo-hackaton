# Python -> Azure OpenAI: DALL·E

Dette eksempelet genererer et bilde av dagens værmelding for Østlandet ved å ta
i bruk Azures OpenAI-tjeneste for bildegenerering (DALL·E) og det åpne API-et
til Yr.

For å kjøre må du logge deg inn på https://portal.azure.com og hente ned en key
og et endpoint fra en passende OpenAI-ressurs som ligger i East US. Azure
støtter ikke bildegenerering i andre lokasjoner enn East US.

Kopier `.env`-eksempelfila og bytt ut verdiene:

```sh
cp .env.EXAMPLE .env
```

Så er det bare å lage et virtual environment (hvis du vil):

```sh
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements.txt
```

Og kjøre koden:

```sh
python3 main.py
```

Hvis alt gikk bra bør det sprette opp et bilde som viser dagens værmelding.
