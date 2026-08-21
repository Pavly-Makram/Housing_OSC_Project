# 🏠 Student Housing & Shared Apartment API

A robust RESTful API built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**. This platform facilitates student housing by connecting students who have available rooms (**Listers**) with students searching for accommodation (**Seekers**).

---

## 🚀 Features

- 🔐 **Authentication & Authorization**: Secure user registration and login using `bcryptjs` and `JWT` (stored in HTTP-Only cookies or sent via Bearer Token).
- 👥 **Role-Based Access Control (RBAC)**: Strict access separation between `Lister` and `Seeker`.
- 🏡 **Listing Management**: Full CRUD operations for listings (restricted to Lister owners).
- 🔍 **Search & Advanced Filtering**: Filter listings by location (regex search), price range, rooms available, and availability status with **Pagination** support.
- 📩 **Interest Request System**:
  - Seekers can send and cancel interest requests.
  - Listers can review, accept, or decline pending requests on their listings.
- 📖 **API Documentation**: Interactive Swagger UI at `/api-docs`.

---

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Security**: JWT (`jsonwebtoken`), `bcryptjs`, `cookie-parser`, `cors`
- **Documentation**: Swagger UI (`swagger-ui-express`, `swagger-jsdoc`)

---

## 👥 User Roles & Permissions

| Feature | Seeker | Lister | Public|
| :--- | :---: | :---: | :---: |
| Browse & Filter Listings | ✅ | ✅ | ✅ |
| Create / Edit / Delete Listings | ❌ | ✅ (Own Only) | ❌ |
| Send / Cancel Request | ✅ | ❌ | ❌ |
| Accept / Decline Request | ❌ | ✅ (Own Listings) | ❌ |
| View Own Profile (`/auth/me`) | ✅ | ✅ | ❌ |

---

## 📡 API Endpoints

### 🔑 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user (`Lister` or `Seeker`) |
| `POST` | `/api/auth/login` | Public | Login & set HTTP-only JWT cookie |
| `POST` | `/api/auth/logout` | Public | Clear JWT auth cookie |
| `GET`  | `/api/auth/me` | Protected | Get current logged-in user details |

---

### 🏡 Listings (`/api/listings`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET`    | `/api/listings` | Public | Get all listings (Supports pagination & query filters) |
| `GET`    | `/api/listings/:id` | Public | Get listing details by ID |
| `POST`   | `/api/listings` | Lister | Create a new property listing |
| `PUT`    | `/api/listings/:id` | Lister (Owner) | Update an existing listing |
| `DELETE` | `/api/listings/:id` | Lister (Owner) | Delete a listing |

---

### 📩 Interest Requests (`/api/requests`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST`   | `/api/requests` | Seeker | Submit an interest request on a listing |
| `GET`    | `/api/requests/seeker/my-requests` | Seeker | View all requests sent by the seeker |
| `DELETE` | `/api/requests/:requestId` | Seeker | Cancel a pending request |
| `GET`    | `/api/requests/lister/my-requests` | Lister | View all requests on lister's properties |
| `PATCH`  | `/api/requests/:requestId/status` | Lister (Owner) | Accept or decline a request |

---

## ⚙️ Installation & Setup

### 1. Clone the repository 
```bash
git clone https://github.com/Pavly-Makram/Housing_OSC_Project.git
cd Housing_OSC_Project