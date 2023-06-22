import os
import textwrap

import openai
import requests
from dotenv import load_dotenv
from PIL import Image
from yr_weather import Textforecast

load_dotenv()

openai.api_base = os.environ["ENDPOINT"]
openai.api_key = os.environ["SUBSCRIPTION_KEY"]
openai.api_version = "2023-06-01-preview"
openai.api_type = "azure"

yr_client = Textforecast(headers={"User-Agent": os.environ["YR_USER_AGENT"]})
forecasts = yr_client.get_forecasts("landoverview")["time"][0]["forecasttype"][
    "location"
]
forecast = next(f for f in forecasts if f["name"] == "Østlandet")["text"]

print("Værmeldingen for Østlandet er:\n")
print(textwrap.fill(forecast, initial_indent="  ", subsequent_indent="  "))
print("\nGenererer et bilde basert på det, vent litt …")

res = openai.Image.create(prompt=f"{forecast} Som et maleri av Christian Krohg.")

img_url = res["data"][0]["url"]
img = requests.get(img_url).content
img_file = "img.png"

with open(img_file, "wb") as f:
    f.write(img)

Image.open(img_file).show()
