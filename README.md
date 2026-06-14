# Xeno CRM – AI-Native Mini CRM

An AI-powered CRM platform built for the Xeno Engineering Take-Home Assignment.

The system enables marketers to manage customers, generate audience segments using AI, create campaigns, simulate message delivery through a separate channel service, and track campaign performance through analytics and history tracking.

---

## Live Deployment

### Frontend (Vercel)
https://xeno-crm-frontend-3ynhv9dfs-parimala-dharshini-m-s-projects.vercel.app/

### Backend (Render)
https://xeno-crm-backend-uayh.onrender.com

### Channel Service (Render)
https://xeno-crm-channel.onrender.com

---

## Features

### Customer Management
- View customer data
- Customer spend analysis
- Customer segmentation

### AI Copilot
- Natural language prompt interface
- AI-powered audience generation
- Campaign generation assistance

### Campaign Management
- Create campaigns
- Send campaigns
- Campaign lifecycle tracking

### Analytics Dashboard
- Delivery metrics
- Open metrics
- Click metrics
- Conversion tracking

### Campaign History
- Timeline of campaign events
- Communication tracking

### Channel Service
- Separate microservice architecture
- Simulated communication delivery
- Event generation

### Receipt Callback System
- Callback-based communication tracking
- CRM receives delivery status updates
- Analytics updated automatically

---

## Tech Stack

### Frontend
- React
- React Router
- Axios
- Recharts

### Backend
- FastAPI
- SQLAlchemy

### Database
- Neon PostgreSQL

### Deployment
- Vercel
- Render

---

## System Architecture

```text
React Frontend (Vercel)
          |
          v
     FastAPI CRM
          |
          v
   Neon PostgreSQL

     FastAPI CRM
          |
          v
   Channel Service
          |
          v
   Receipt Callback
          |
          v
 Analytics & History
```

---

## AI-Native Features

The AI Copilot allows marketers to:

- Generate customer segments using natural language prompts
- Create campaign ideas
- Preview audience definitions
- Assist campaign planning workflows

---

## Local Setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Channel Service

```bash
cd channel-service
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## Assignment Requirements Covered

✅ Customer ingestion

✅ Order management

✅ Audience segmentation

✅ AI-powered campaign generation

✅ Separate channel service

✅ Callback-based delivery tracking

✅ Analytics dashboard

✅ Campaign history

✅ Hosted deployment

---

## Author

Parimala Dharshini M
RA2311008020132
B.Tech Information Technology
SRM Institute of Science and Technology
