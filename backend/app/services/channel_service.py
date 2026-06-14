import requests


def send_to_channel_service():

    response = requests.post(
    "https://xeno-crm-channel.onrender.com/send"
)

    return response.json()
