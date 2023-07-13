require('dotenv').config()

const axios = require('axios')
const fs = require('fs')

const endpoint = process.env.ENDPOINT
const subscriptionKey = process.env.SUBSCRIPTION_KEY
const imagePath = './demo_image_photo_nikolai_kobets_freund.jpg'

async function analyzeImage() {
  const parameters = {
    /*//
    features: 'people,objects,smartCrops,caption,tags,denseCaptions',
    language: 'en',
    //*/

    //*// Litt begrenset støtte for norsk språk, men tags funker
    features: 'tags',
    language: 'nb',
    //*/
    'model-version': 'latest',
    'api-version': '2023-02-01-preview',
  }

  const headers = {
    'Content-Type': 'application/octet-stream',
    'Ocp-Apim-Subscription-Key': subscriptionKey,
  }

  const url = endpoint + 'computervision/imageanalysis:analyze?' + new URLSearchParams(parameters)

  let imageData = fs.readFileSync(imagePath)

  try {
    const response = await axios.post(url, imageData, { headers: headers })
    console.log(JSON.stringify(response.data, null, 2))
    //console.table(response.data.tagsResult.values)
  } catch (error) {
    console.log(error)
  }
}

analyzeImage()

/*

Docs:

https://centraluseuap.dev.cognitive.microsoft.com/docs/services/unified-vision-apis-public-preview-2023-02-01-preview/operations/61d65934cd35050c20f73ab6

https://learn.microsoft.com/nb-no/azure/cognitive-services/computer-vision/quickstarts-sdk/image-analysis-client-library-40?tabs=visual-studio%2Cwindows&pivots=programming-language-rest-api#prerequisites

*/
