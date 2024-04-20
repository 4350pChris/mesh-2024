import smtplib
from email.mime.text import MIMEText

# Local SMTP server configuration
smtp_server = "matrix.ennen.dev"
smtp_port = 2525

# Email details
sender_email = "customer@example.com"  # This can be any arbitrary email address
receiver_email = "support@matrix.ennen.dev"
subject = "Hello World"
body = "This is a test email sent from Python."

# Create the email message
msg = MIMEText(body)
msg['Subject'] = subject
msg['From'] = sender_email
msg['To'] = receiver_email
smtp_conn = False
try:
    # Create the SMTP connection
    smtp_conn = smtplib.SMTP(smtp_server, smtp_port)
    
    # Send the email
    smtp_conn.send_message(msg)
    
    print("Email sent successfully!")
except Exception as e:
    print(f"Error occurred: {e}")
finally:
    # Close the SMTP connection
    smtp_conn and smtp_conn.quit()
