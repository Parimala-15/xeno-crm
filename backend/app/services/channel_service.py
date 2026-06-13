import requests


def send_to_channel_service():

    response = requests.post(
        "http://127.0.0.1:8001/send"
    )

    return response.json()