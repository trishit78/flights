# Notification Service

The **Notification Service** is a background worker service designed to handle asynchronous communication. It completely decouples the act of "requesting a notification" (from the Booking Service) from the "sending of the notification" (Email). This service uses **BullMQ** and **Redis** for reliable job processing.

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
        "appName": Flight Booking,
      }
    }
    ```

### 2. The Worker (Consumer)
*   **File:** `src/processor/mailer.processor.ts`
*   **Logic:**
    *   The `setupMailerWorker` function initializes a `Worker` that listens to `queue-mailer`.
    *   It picks up the job and validates the job name (`payload-mail`).
    *   Processes the job and handles retries on failure.

### 3. Processing & Sending
*   **Template Rendering:**
    *   The service takes the `templateId` (e.g., "booking_success") and `params`.
    *   It finds the corresponding handlebar template in `src/template`.
    *   It renders the final HTML by injecting the parameters (e.g., User Name, Booking ID, Flight Details, Price).
*   **Sending Email:**
    *   **File:** `src/service/mailer.service.ts`
    *   Uses **Nodemailer** with the credentials from `.env` to send the email to the recipient's address (`to`).
    *   Supports HTML email templates.

---

## 🏗️ Architecture

### Service Flow

```
Booking Service (Producer)
    ↓
Redis Queue (queue-mailer)
    ↓
Notification Service Worker (Consumer)
    ↓
Template Engine (Handlebars)
    ↓
Email Service (Nodemailer)
    ↓
Email Sent to User
```

### Queue Configuration

**Queue Name**: `queue-mailer`

**Job Processing:**
- Jobs are processed asynchronously
- Automatic retries on failure (configurable)
- Job status tracking (waiting, active, completed, failed)
- Dead letter queue for permanently failed jobs

### Email Templates

Templates are stored in `src/template/` directory:
- Handlebars (`.hbs`) format
- Dynamic parameter injection
- HTML email support

**Available Templates:**
- `booking_success` - Booking confirmation email

### Database

**No Database Required** - This is a stateless worker service that processes jobs from Redis queue.

---

## 🚀 Running the Service

### Development

```bash
npm install
npm run dev
```

The service will start on `http://localhost:8000` and begin processing jobs from the queue.

### Production

```bash
npm install
npm run build
npm start
```



---

## 🔧 Dependencies

### Core Dependencies
- `express` (v5.1.0) - Web framework (for health checks)
- `bullmq` (v5.66.2) - Redis-based job queue
- `ioredis` (v5.8.2) - Redis client
- `nodemailer` (v7.0.12) - Email sending
- `handlebar` (v1.0.0) - Email templating
- `winston` (v3.17.0) - Logging
- `winston-daily-rotate-file` (v5.0.0) - Log rotation
- `zod` (v3.24.2) - Schema validation
- `uuid` (v11.1.0) - UUID generation

### Development Dependencies
- `typescript` (v5.8.3)
- `ts-node` (v10.9.2)
- `nodemon` (v3.1.9)

---

## 🏗️ Architecture Benefits

*   **Non-blocking:** The user gets a "Booking Confirmed" response immediately from the Booking Service without waiting for the email to be sent.
*   **Retries:** If the email server is down, BullMQ handles retries automatically without losing the request.
*   **Scalability:** You can run multiple instances of this Notification Service to process thousands of emails purely by connecting to the same Redis instance.
*   **Reliability:** Jobs are persisted in Redis, so they survive service restarts.
*   **Monitoring:** Queue status can be monitored via Bull Board UI in Booking Service (`http://localhost:4000/ui`).

---

## 📧 Email Configuration

### Gmail Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Create a new app password for "Mail"
3. Use the app password in `MAIL_PASS` environment variable

### Other Email Providers

Update the Nodemailer configuration in `src/config/email.config.ts` for other providers (SMTP settings).

---

## 🔍 Monitoring

### Queue Monitoring

Monitor the queue status via Bull Board UI in the Booking Service:
- **URL**: `http://localhost:4000/ui`
- View job counts (waiting, active, completed, failed)
- Retry failed jobs
- Clear queues

### Logging

The service uses **Winston** for structured logging with daily log rotation:
- Log files: `logs/YYYY-MM-DD-app.log`
- Log levels: `error`, `warn`, `info`, `debug`
- Includes job processing logs

---

## 📝 Notes

- The service is **stateless** and can be horizontally scaled
- Jobs are processed in FIFO order (configurable)
- Failed jobs are automatically retried (configurable retry policy)
- Email templates use Handlebars for dynamic content
- Port **8000** is used for the service (health check endpoint)
- The service continuously polls Redis for new jobs

---
