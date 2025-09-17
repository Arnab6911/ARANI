from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    FIREBASE_CREDENTIALS_PATH: str
    google_api_key: str
    class Config:
        env_file = ".env"

settings = Settings()