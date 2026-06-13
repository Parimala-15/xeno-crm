import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)


def generate_segment(prompt: str):

    try:

        model = genai.GenerativeModel(
            "gemini-2.0-flash"
        )

        response = model.generate_content(
            f"""
            Convert this marketing request into JSON.

            Request:
            {prompt}

            Return only JSON.

            Example:

            {{
                "segment_name":"Dormant Customers",
                "rules": {{
                    "inactive_days":90,
                    "spend_gt":5000
                }}
            }}
            """
        )

        return {
            "success": True,
            "response": response.text
        }

    except Exception:

        return {
            "success": True,
            "response": {
                "segment_name": "Dormant Customers",
                "description": prompt,
                "rules": {
                    "inactive_days": 90,
                    "spend_gt": 5000
                },
                "fallback": True
            }
        }


def generate_campaign(goal: str):

    try:

        model = genai.GenerativeModel(
            "gemini-2.0-flash"
        )

        response = model.generate_content(
            f"""
            You are an AI marketing strategist.

            Goal:
            {goal}

            Return only JSON.

            Example:

            {{
                "segment":"Dormant Customers",
                "message":"We miss you! Get 15% off.",
                "channel":"WhatsApp"
            }}
            """
        )

        return {
            "success": True,
            "response": response.text
        }

    except Exception:

        return {
            "success": True,
            "response": {
                "segment": "Dormant Customers",
                "goal": goal,
                "message": "We miss you! Get 15% off on your next purchase.",
                "channel": "WhatsApp",
                "fallback": True
            }
        }