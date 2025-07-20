# 💊 Pharmacy Manager API - Alternative Drug System for Gaza

## 🌟 Introduction
**Pharmacy Manager** is a powerful API-only application designed to manage and track alternative medications in the Gaza Strip, especially during drug shortages.  
Due to frequent unavailability of essential drugs, many pharmacies have resorted to providing alternative medications.  
This platform is designed to **centralize and streamline the management of alternative drugs** and their availability across registered pharmacies.

It aims to help both **individual pharmacies** and the **Ministry of Health** to track alternative options efficiently, instead of manually searching through multiple pharmacies.

It allows:
- Adding and managing main drugs
- Assigning alternatives to them
- Tracking where each drug is available

---

## 📸 Key Features and Screenshots

Since this project is an API-only application, interactions are made through **Postman**.

### 1. Signup Page
User signup with username, email, and password.
![Signup Success](assets/images/login.png)  
![Email Already Exists](assets/images/login-exits.png)

### 2. Login Page
User login with username and password.
![Login Success](assets/images/loginsucsess.png)  
![Email Not Found](assets/images/email-notfound.png)  
![Missing Credentials](assets/images/no-email-pass.png)

### 3. Add Main Drug
Add a main drug to the system.
![Add Main Drug](assets/images/add-main-drug.png)

### 4. Add Alternative Drug
Add alternative drug and assign it to main drug & one or more pharmacies.
![Add Alt Drug](assets/images/add-alt-drug.png)

### 5. CRUD Pharmacies
- View all pharmacies  
- View specific pharmacy  
- Add new pharmacy  
- Update pharmacy  
- Delete pharmacy  
![Pharmacies View](assets/images/view-pharmacies.png)

---

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: bcryptjs
- **Input Validation**: @hapi/joi
- **Environment Variables**: dotenv
- **API Testing**: Postman

---

## ⚙️ Installation and Setup

### 1. Clone the Repository
```bash
git clone https://github.com/username/pharmacy-manager-api.git
