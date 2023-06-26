import os
import textwrap

import openai
import requests
from dotenv import load_dotenv
from PIL import Image
from yr_weather import Textforecast


def get_forecast():
    """Return today's forecast for Østlandet."""

    yr_client = Textforecast(headers={"User-Agent": os.environ["YR_USER_AGENT"]})
    forecasts = yr_client.get_forecasts("landoverview")["time"][0]["forecasttype"][
        "location"
    ]
    return next(f for f in forecasts if f["name"] == "Østlandet")["text"]


def generate_image(forecast):
    """Generate an image based on `forecast` and return its file name."""

    openai.api_base = os.environ["ENDPOINT"]
    openai.api_key = os.environ["SUBSCRIPTION_KEY"]
    openai.api_version = "2023-06-01-preview"
    openai.api_type = "azure"

    res = openai.Image.create(prompt=f"{forecast} Som et maleri av Christian Krohg.")

    img_url = res["data"][0]["url"]
    img = requests.get(img_url).content
    img_file = "img.png"

    with open(img_file, "wb") as f:
        f.write(img)

    return img_file


if __name__ == "__main__":
    load_dotenv()

    forecast = get_forecast()

    print("Værmeldingen for Østlandet er:\n")
    print(textwrap.fill(forecast, initial_indent="  ", subsequent_indent="  "))
    print("\nGenererer et bilde basert på det, vent litt …")

    img_file = generate_image(forecast)
    Image.open(img_file).show()
