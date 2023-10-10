import os
import smtplib

from dotenv import load_dotenv

load_dotenv()

# Replace these with your actual email settings
EMAIL_HOST = os.getenv("DJANGO_EMAIL_HOST", "")
EMAIL_PORT = os.getenv("DJANGO_EMAIL_PORT", "587")
EMAIL_HOST_USER = os.getenv("DJANGO_EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.getenv("DJANGO_EMAIL_HOST_PASSWORD", "")

try:
    server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
    server.starttls()
    server.login(EMAIL_HOST_USER, EMAIL_HOST_PASSWORD)
    print("SMTP server connection successful.")
except Exception as e:
    print(f"SMTP server connection error: {e}")
finally:
    server.quit()