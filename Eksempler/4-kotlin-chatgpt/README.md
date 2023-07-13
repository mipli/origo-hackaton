# ChatGPT med Kotlin / React

Eksempelkode for bruk av Azure sitt ChatGPT-API.

## Oppsett av ChatGPT-deployment i Azure

- Åpne [Azure OpenAI](https://portal.azure.com/#view/Microsoft_Azure_ProjectOxford/CognitiveServicesHub/~/OpenAI) i Azure Portal
- Velg [OpenAI-ressursen](https://portal.azure.com/#@oslokommune.onmicrosoft.com/resource/subscriptions/1935e788-aece-4955-8c43-bad4bf16912a/resourceGroups/West-EU-RG/providers/Microsoft.CognitiveServices/accounts/openai-test-for-hackathon-research-EU/overview) som ligger i EU
- Trykk på **Explore** for å komme inn i OpenAI Studio.
- Velg **Deployments** i menyen til venstre.
- Trykk **Create new deployment** for å opprette et miljø å jobbe i for teamet ditt.
- Velg **gpt-35-turbo** som model og gi et navn til deploymenten.
- Åpne **Advanced options** og sett en fornuftig rate limit. Anbefalt rate limit er **20K**.
- Trykk **Create**.

## Backend

Følgende kommandoer setter nødvendige miljøvariabler, bygger Kotlin-koden og starter en Jetty-server på port 9000:

```
export DEPLOYMENT_NAME=<Navnet på din deployment i OpenAi Studio>
export API_KEY=<KEY fra ressursen i Azure -> Keys and endpoint>
export ENDPOINT=<Endpoint fra ressursen i Azure -> Keys and endpoint>
cd api
./gradlew run
```

Applikasjonen er klar når siste melding i terminalen er _Responding at http://0.0.0.0:9000_, selv om progress-baren bare viser 80%.

Naviger til http://localhost:9000/ og se at den returnerer OK.

## Frontend

Følgende kommandoer bygger Typescript-koden og starter en development-server på port 3000:

```
cd client
npm i
npm start
```

Naviger til http://localhost:3000/
