# ZenPay – Full Stack Payment Ecosystem

ZenPay is a production-grade, full-stack payment platform supporting real-time peer-to-peer transactions, bill splitting among users, and merchant payment collections. Built with a modern microservices architecture, ZenPay delivers robust security, asynchronous processing, and intuitive dashboards for both consumers and businesses.

---

## Table of Contents

1. [Product Overview](#product-overview)  
2. [Core Features](#core-features)  
3. [User Application Walkthrough](#user-application-walkthrough)  
   - [Dashboard](#dashboard)  
   - [Quick Transfer (Deposit / Withdraw)](#quick-transfer)  
   - [P2P Transfer](#p2p-transfer)  
   - [Bills Split](#bills-split)  
   - [Notifications & Pending Actions](#notifications--pending-actions)  
   - [Approve Split Payments](#approve-split-payments)  
   - [Account Settings (MPIN, Balances & Transactions)](#account-settings)  
4. [Technology Stack](#technology-stack)  
5. [Getting Started & Deployment](#getting-started--deployment)  

---

## Product Overview

ZenPay is maintained within a single monorepo, leveraging npm workspaces to streamline dependencies, development workflows, and consistent versioning across projects.

It is divided into two independent applications within this unified codebase:

- **User App**: Digital wallet for P2P transfers, bill splitting, deposits, withdrawals, and personal analytics.  
- **Merchant App**: Business dashboard for payment collections, settlements, and sales analytics.

Below is a detailed walkthrough of the **User Application** interface and features.

---

## Core Features

- **Monorepo Architecture**: Centralized repository with npm workspaces for unified dependency management and streamlined CI/CD.  
- **Real-Time Transactions**: Sub-100ms latency for transfers, deposits, and withdrawals.  
- **Bill Splitting**: Equal or custom splits among friends, with settlement tracking.  
- **Merchant Collections**: Dedicated app for businesses to receive and reconcile payments.  
- **Security**: JWT-based authentication, MPIN verification, Redis-backed OTP flows, and secure bank webhooks.  
- **Asynchronous Architecture**: Message queues ensure reliable processing even under load.  
- **Comprehensive Analytics**: Insightful dashboards for both users and merchants.  
- **DevOps**: Dockerized microservices with CI/CD pipelines for rapid deployments.  

---

## User Application Walkthrough

### Dashboard

Home screen summarizing your account at a glance:

- **Balance Card**: Shows available balance with refresh and visibility toggle.  
- **Quick Actions**: Buttons to add money, send money, request payments, or split bills.  
- **Key Metrics**: Total spent, P2P transfers, deposits, withdrawals, and friends paid.  
- **Recent Transactions**: A snapshot of the latest activity.

![image](https://github.com/user-attachments/assets/d9fd380a-8e8d-4b9a-af1f-c61a52eaca6e)
*User Dashboard: Overview of balance, quick actions, and recent activity.*

---

### Quick Transfer (Deposit / Withdraw)

A consolidated interface for adding or withdrawing funds from linked bank accounts:

- **Deposit Tab**: Enter amount and select bank, then proceed to confirmation.  
- **Withdraw Tab**: View unlocked vs. locked balances before initiating a withdrawal.  
- **Recent Transactions**: Quick links to view all deposit or withdrawal history.

![image](https://github.com/user-attachments/assets/7e41c251-523f-46d4-b8b3-d60befd13905)
*Deposit funds into your ZenPay wallet.*
*Withdraw available balance back to your bank account.*

---

### P2P Transfer

Send money directly to your contacts with instant settlement:

- **Contact Search**: Filter your saved contacts by name, phone, or email.  
- **Transaction Panel**: Enter amount and confirm with MPIN/OTP for security.  
- **Recent P2P Activity**: Side panel lists all recent peer-to-peer transactions.

![image](https://github.com/user-attachments/assets/2d5d1f1e-b5d8-4f72-bb04-76494fae5caa)
*Peer-to-peer money transfer interface.*

---

### Bills Split

Manage shared expenses within social circles:

- **Overview Metrics**: Pending payments, credits, total splits, and active splits.  
- **Split List**: View all splits (all/pending/completed) with search and filter.  
- **Create Split**: Add participants, set total amount, choose split mode, and assign shares.

![image](https://github.com/user-attachments/assets/848d3f9e-fb2f-4a65-bedc-2a593e9bdce8)
*Overview of pending and completed bill splits.*

![image](https://github.com/user-attachments/assets/e9d97394-ebab-45cc-90f3-ea7a1ac54c46)
*Modal for configuring a new split: select contacts and confirm shares.*

---

### Notifications & Pending Actions

Centralized feed for approvals and alerts:

- **All / Pending Tabs**: Toggle between all notifications or only pending actions.  
- **Action Buttons**: Approve or reject splits, with direct links to details.

![image](https://github.com/user-attachments/assets/282400b3-110c-421b-a2f6-9cae7cf976d8)
*Notification center for split approvals and system alerts.*

---

### Approve Split Payments

Detailed view for each pending split:

- **Split Summary**: Title, creation timestamp, and creator info.  
- **Participant List**: Names, contact details, and share amounts.  
- **Action Panel**: Reject or approve & pay via the same interface.

![image](https://github.com/user-attachments/assets/5e045887-4874-4c88-8112-bb6bf1a457bd)
*Approve or reject a pending split payment with full context.*

---

### Account Settings

Manage your profile, MPIN, and view full transaction history:

- **MPIN Management**: Set or update your secure four-digit PIN.

  ![image](https://github.com/user-attachments/assets/bf1f8999-cb5d-4ea3-909d-a38a32ce37be)
  *Securely set or change your transaction MPIN.*

- **Balances & Transactions**: Detailed breakdown of deposits, withdrawals, P2P transfers, and overall balances.

  ![image](https://github.com/user-attachments/assets/04935753-4561-4a5e-997d-5656ba758274)
  *Full view of your financial activity.*

---

## Technology Stack

This platform is organized as a monorepo using npm workspaces, enabling consistent dependency management and simplified cross-project integrations.

| Layer           | Technology                                                  |
|-----------------|-------------------------------------------------------------|
| Frontend        | Next.js, Tailwind CSS                                       |
| Backend         | Node.js, Express.js microservices                            |
| Database        | PostgreSQL with Prisma ORM                                   |
| Cache / Session | Redis for OTP and session management                         |
| Auth            | NextAuth.js (JWT) + MPIN multi-factor authentication         |
| Monorepo        | npm workspaces for sharing UI components across apps         |
| DevOps          | Docker, Docker Compose, GitHub Actions CI/CD                 |

---

## Getting Started & Deployment

1. **Clone the repository**:

   ```bash
   git clone https://github.com/jaibhagtani/ZenPay-Payment-App.git
   cd ZenPay-Payment-App
   npm install
2. Configure environment:

Copy .env.example to .env and update:
SECRET_KEY, JWT_SECRET
DATABASE_URL
REDIS_URL
Email SMTP credentials

3. Run Locally:

npm run dev --workspace=apps/user     # Start the User App
npm run dev --workspace=apps/merchant # Start the Merchant App
