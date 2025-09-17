import google.generativeai as genai
from app.core.config import settings
import json
from typing import Dict, Any

class AIEngine:
    _model = None

    def __init__(self):
        if AIEngine._model is None:
            print("Configuring Google AI for Multi-Department Analysis...")
            try:
                genai.configure(api_key=settings.google_api_key)
                AIEngine._model = genai.GenerativeModel('gemini-1.5-flash')
                print("Google AI Model configured successfully.")
            except Exception as e:
                print(f"Error configuring Google AI: {e}")
                raise
        self.model = AIEngine._model

    def analyze(self, text: str) -> Dict[str, Any]:
        if not self.model:
            return {"error": "Model is not configured."}

        # THIS IS THE NEW, MORE ADVANCED PROMPT
        prompt = f"""
        You are an expert multi-department issue routing system for the city of Kolkata, India.
        Analyze the following citizen grievance complaint. Your task is to identify ALL relevant departments that need to be involved to resolve the issue.

        The available departments are: ["PWD", "Water", "Electricity", "Sanitation", "Traffic", "Health", "Other"].

        Based on the text, provide the following information in a strict JSON format:
        1. "departments": A JSON array of strings, listing ALL relevant department names from the list above.
        2. "urgency": Rate the urgency on a scale of 1 (Low) to 5 (Critical).
        3. "summary": A concise, one-sentence summary of the core issue.

        Here is an example of a complex complaint and your required JSON output:
        ---
        COMPLAINT_EXAMPLE: "The heavy rain has caused severe waterlogging near the main market, and the water is entering the open transformer box, causing sparks. The whole road is blocked, creating a massive traffic jam."
        JSON_EXAMPLE:
        {{
          "departments": ["PWD", "Electricity", "Traffic"],
          "urgency": 5,
          "summary": "Waterlogging is causing electrical hazards at a transformer and blocking traffic near the main market."
        }}
        ---

        Now, analyze this real complaint:
        COMPLAINT: "{text}"
        JSON_RESPONSE:
        """

        try:
            response = self.model.generate_content(prompt)
            response_text = response.text.strip().replace("```json", "").replace("```", "").strip()
            json_response = json.loads(response_text)
            
            # Ensure 'departments' is always a list
            if 'departments' not in json_response or not isinstance(json_response['departments'], list):
                json_response['departments'] = ['Other']

            return json_response
        except Exception as e:
            print(f"An error occurred during Gemini API call: {e}")
            return {
                "departments": ["Other"],
                "urgency": 2,
                "summary": "AI analysis failed, manual classification required.",
                "error": str(e)
            }

engine = AIEngine()