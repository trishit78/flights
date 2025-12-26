# Notification Service

The **Notification Service** is a background worker service designed to handle asynchronous communication. It completely decouples the act of "requesting a notification" (from the Booking Service) from the "sending of the notification" (Email).

## ⚙️ Configuration (.env)

Create a `.env` file in this directory:

```env
PORT=8000

# Redis (Message Broker)
# This must match the Redis configuration in the Booking Service
REDIS_PORT=6379
REDIS_HOST="localhost"

# Email Configuration (Nodemailer)
# Use an App Password if using Gmail
MAIL_USER="your-email@gmail.com"
MAIL_PASS="your-app-password"
```

## 📨 Asynchronous Communication Flow

The system uses a **Producer-Consumer** pattern with **Redis** and **BullMQ**.

### 1. The Trigger (Producer)
*   **Source:** [Flights Booking Service](../flights%20booking%20service)
*   **Event:** When a user successfully confirms a payment (`makePaymentService`).
*   **Action:** The Booking Service pushes a job to the Redis queue.
*   **Queue Name:** `queue-mailer`
*   **Job Name:** `payload-mail`
*   **Payload (`NotificationDTO`):**
    ```json
    {
      "to": "user@example.com",
      "subject": "Flight Booking Confirmed",
      "templateId": "booking_success",
      "params": {
        "name": "John Doe",
        "bookingId": 123
      }
    }
    ```

### 2. The Worker (Consumer)
*   **File:** `src/processor/mailer.processor.ts`
*   **Logic:**
    *   The `setupMailerWorker` function initializes a `Worker` that listens to `queue-mailer`.
    *   It picks up the job and validates the job name (`payload-mail`).

### 3. Processing & Sending
*   **Template Rendering:**
    *   The service takes the `templateId` (e.g., "booking_success") and `params`.
    *   It finds the corresponding handlebar template in `src/template`.
    *   It renders the final code by injecting the parameters (e.g., User Name, Price).
*   **Sending Email:**
    *   **File:** `src/service/mailer.service.ts`
    *   Uses **Nodemailer** with the credentials from `.env` to send the email to the recipient's address (`to`).

---

## 🏗️ Architecture Benefits
*   **Non-blocking:** The user gets a "Booking Confirmed" response immediately from the Booking Service without waiting for the email to be sent.
*   **Retries:** If the email server is down, BullMQ handles retries automatically without losing the request.
*   **Scalability:** You can run multiple instances of this Notification Service to process thousands of emails purely by connecting to the same Redis instance.


