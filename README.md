
# 🧩 Humanity Founders Portal – Backend

This is the **backend for the Humanity Founders Employee Management Portal**, built using the **MERN Stack**.  
It provides APIs for **Managers** and **Employees** to handle authentication, task assignment, daily updates, and Cloudinary-based media uploads.

---

## 🚀 Tech Stack

- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **Cloudinary** for file storage (profile pictures, screenshots)
- **JWT** for authentication
- **Multer** for file uploads
- **Nodemailer** for sending email credentials
- **CORS + Cookie Parser** for secure communication

---

## 🧠 Folder Structure

```

📦 Humanity Founders Portal Backend
┣ 📂models
┃ ┣ Employer.models.js        → Employee schema
┃ ┗ Manager.models.js         → Manager schema
┣ 📂controllers
┃ ┣ employee.controllers.js   → Employee operations
┃ ┗ Manager.controllers.js    → Manager operations
┣ 📂routes
┃ ┣ Employee.routes.js        → Employee API routes
┃ ┗ Manager.routes.js         → Manager API routes
┣ 📂middleware
┃ ┣ employee.middleware.js    → JWT verification middleware
┃ ┗ multer.middlewares.js     → File upload handling
┣ 📂utils
┃ ┣ Apierror.utils.js         → Standard error handling
┃ ┣ Apiresponse.utils.js      → Unified response format
┃ ┗ Cloudinary.utils.js       → Cloudinary file uploader
┣ 📜 app.js                   → Express app setup
┗ 📜 server.js                → Entry point (connects DB + starts server)

````

---

## 🔐 Authentication Flow

- **JWT tokens** are generated at login.
- Tokens are stored in **HTTP-only cookies** for secure access.
- The `verifyjwt` middleware validates tokens and attaches the logged-in user to `req.user`.

---

## ⚙️ API Endpoints

---

### 👨‍💼 Manager Routes
Base URL: `/api/v1/manager`

---

#### **1️⃣ Add Employee**
**Endpoint:** `POST /addemployee`  
**Description:** Adds a new employee to the database and sends login credentials via email.

**Required Fields (Body):**

| Field | Type | Required | Description |
|--------|------|-----------|-------------|
| `email` | String | ✅ | Employee’s email ID |
| `name` | String | ✅ | Employee’s full name |
| `password` | String | ✅ | Default password |
| `designation` | String | ✅ | Employee’s designation |
| `status` | String | ✅ | One of `["Active & Paid","Active & Unpaid","Inactive","Onboarding"]` |

**Response Example:**
```json
{
  "success": true,
  "message": "User Created Successfully",
  "data": {
    "_id": "6721bce42f3f6b4d9340",
    "name": "Mohammad Ziya",
    "email": "ziya@example.com"
  }
}
````

**Auto Email Sent To Employee:**

```
Your Credentials for the login to Job Portal are given below:
Id : 6721bce42f3f6b4d9340
Password : yourpassword
```

---

#### **2️⃣ Assign Task**

**Endpoint:** `POST /assigntask`
**Description:** Assigns a new task to a specific employee.

**Required Fields (Body):**

| Field           | Type   | Required | Description                        |
| --------------- | ------ | -------- | ---------------------------------- |
| `employeeid`    | String | ✅        | MongoDB Employee `_id`             |
| `title`         | String | ✅        | Task title                         |
| `details`       | String | ✅        | Task details                       |
| `assigneddate`  | String | ✅        | Task assigned date                 |
| `linkedproject` | String | ✅        | Project name or ID                 |
| `duration`      | String | ✅        | Expected duration (e.g., `3 days`) |

**Response Example:**

```json
{
  "success": true,
  "message": "Task assigned Successfully",
  "data": {
    "tasks": [
      {
        "title": "UI Redesign",
        "details": "Revamp dashboard layout",
        "linkedProject": "Frontend Portal",
        "duration": "3 days"
      }
    ]
  }
}
```

---

### 👨‍💻 Employee Routes

Base URL: `/api/v1/employee`

---

#### **1️⃣ Employee Login**

**Endpoint:** `POST /login`
**Description:** Logs in an employee using their unique ID and password.

**Required Fields (Body):**

| Field      | Type   | Required | Description             |
| ---------- | ------ | -------- | ----------------------- |
| `id`       | String | ✅        | Employee ID (from mail) |
| `password` | String | ✅        | Password                |

**Response Example:**

```json
{
  "success": true,
  "message": "Employee Loginned Successfully",
  "data": {
    "name": "Mohammad Ziya",
    "email": "ziya@example.com",
    "designation": "Full Stack Developer"
  }
}
```

A JWT token is automatically stored in cookies.

---

#### **2️⃣ Get Employee Details**

**Endpoint:** `GET /getdetails`
**Middleware:** `verifyjwt`
**Description:** Fetches logged-in employee data from token.

**Response Example:**

```json
{
  "success": true,
  "message": "User Details Fetched Successfully",
  "data": {
    "name": "Mohammad Ziya",
    "email": "ziya@example.com",
    "designation": "Full Stack Developer",
    "status": "Active & Paid"
  }
}
```

---

#### **3️⃣ Update Employee Details**

**Endpoint:** `PUT /updatedetails`
**Middleware:** `verifyjwt`, `multer`
**Description:** Allows employees to update their personal details and upload profile/TopTracker/Telegram snaps.

**Form Fields (Multipart/Form-Data):**

| Field            | Type   | Required | Description                  |
| ---------------- | ------ | -------- | ---------------------------- |
| `profilepicture` | File   | ❌        | Profile image                |
| `telegramsnap`   | File   | ❌        | Screenshot from Telegram bot |
| `toptrackersnap` | File   | ❌        | Screenshot from TopTracker   |
| `telegramid`     | String | ❌        | Employee’s Telegram ID       |
| `toptrackerid`   | String | ❌        | Employee’s TopTracker ID     |
| `phonenumber`    | String | ❌        | Employee phone number        |

**Response Example:**

```json
{
  "success": true,
  "message": "Credentials Saved Successfully",
  "data": {
    "profilepicture": "https://res.cloudinary.com/....jpg",
    "telegramid": "@ziya_dev",
    "topTrackerid": "TT-12345"
  }
}
```

---

#### **4️⃣ Daily Updates**

**Endpoint:** `POST /dailyupdates`
**Middleware:** `verifyjwt`
**Description:** Employee submits daily work updates.

**Required Fields (Body):**

| Field         | Type   | Required | Description              |
| ------------- | ------ | -------- | ------------------------ |
| `projectname` | String | ✅        | Name of the project      |
| `description` | String | ✅        | Description of work done |

**Response Example:**

```json
{
  "success": true,
  "message": "Daily Updates saved Successfully",
  "data": {
    "updates": [
      {
        "projectname": "Frontend Revamp",
        "description": "Completed UI for dashboard",
        "date": "2025-11-01T14:00:00.000Z"
      }
    ]
  }
}
```

---

## 🧾 Models Overview

### **Employee Model Fields**

| Field            | Type    | Description                              |
| ---------------- | ------- | ---------------------------------------- |
| `name`           | String  | Employee full name                       |
| `email`          | String  | Employee email                           |
| `gender`         | String  | “Male” or “Female”                       |
| `password`       | String  | Hashed password                          |
| `telegramid`     | String  | Telegram user ID                         |
| `profilepicture` | String  | Cloudinary URL                           |
| `telegramsnap`   | String  | Screenshot URL                           |
| `topTrackerSnap` | String  | Screenshot URL                           |
| `topTrackerid`   | String  | TopTracker ID                            |
| `designation`    | String  | Employee’s position                      |
| `status`         | Enum    | “Active & Paid”, “Active & Unpaid”, etc. |
| `tasks`          | Array   | List of assigned tasks                   |
| `updates`        | Array   | Daily work updates (with auto date)      |
| `isVerified`     | Boolean | Default: false                           |

---

## 📤 File Upload Handling

* File uploads are managed via **Multer** middleware.
* Files are uploaded to **Cloudinary** using `uploadcloudinary()` utility.
* Temporary local files are deleted after successful upload.

---

## 📧 Email Notification

* Uses `nodemailer` with **SiteGround SMTP** to send new employee credentials.
* Sender: `notification@humanityfounders.com`

---

## 🔒 Authentication Middleware

**`verifyjwt`**:

* Extracts token from cookie or header (`Authorization: Bearer <token>`)
* Verifies it using `process.env.JWT_TOKEN`
* Attaches logged-in employee to `req.user`

---

## 🧠 Response Format

All APIs return a unified JSON structure:

```json
{
  "success": true,
  "message": "Descriptive message",
  "data": {...}
}
```

---

## 🧪 Example Frontend Integration Flow

1. **Login Employee**

   * `POST /api/v1/employee/login`
   * Save cookie or JWT.

2. **Fetch Details**

   * `GET /api/v1/employee/getdetails` (auto-authenticated via cookie).

3. **Upload Details**

   * `PUT /api/v1/employee/updatedetails` (FormData with files).

4. **Submit Daily Update**

   * `POST /api/v1/employee/dailyupdates` with JSON body.

5. **Manager Dashboard**

   * `POST /api/v1/manager/addemployee`
   * `POST /api/v1/manager/assigntask`

---

## 🧾 Environment Variables

| Variable            | Description               |
| ------------------- | ------------------------- |
| `DB_URI`            | MongoDB connection string |
| `DB_NAME`           | Database name             |
| `PORT`              | Server port               |
| `JWT_TOKEN`         | JWT secret for employees  |
| `JWT_TOKEN_MANAGER` | JWT secret for managers   |
| `TOKEN_EXPIRY`      | Token expiry (e.g., `7d`) |
| `CLOUD_NAME`        | Cloudinary cloud name     |
| `API_KEY`           | Cloudinary API key        |
| `API_SECRET`        | Cloudinary secret         |
| `SMTP_HOST`         | SMTP server               |
| `SMTP_USER`         | SMTP username             |
| `SMTP_PASS`         | SMTP password             |

---

## 🧭 Setup Instructions

```bash
# 1️⃣ Clone repo
git clone https://github.com/ziyamohammad/HumanityFounders-Portal-Backend.git

# 2️⃣ Install dependencies
npm install

# 3️⃣ Configure environment
Create a `.env` file with all the required environment variables.

# 4️⃣ Run server
npm run dev
```

---

## 👨‍💻 Developer Info

**Author:** Mohammad Ziya
**Role:** Full Stack Developer Intern @ Humanity Founders
**GitHub:** [@ziyamohammad](https://github.com/ziyamohammad)
