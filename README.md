# Courier Delivery Management System

![Courier Delivery](CouriercClientAngular/src/app/assets/images/courier.jpg)

## Project Overview
The **Courier Delivery Management System** streamlines courier operations by offering tools for parcel tracking, delivery management, and customer communication. This document provides an overview of the technologies used in both backend and frontend development.

---

## Backend Technologies

**Framework:**  
- **ASP.NET Core Web API** (Version 8.0)

**Authentication & Authorization:**  
- `Microsoft.AspNetCore.Authentication.JwtBearer` (8.0.10)

**Database & ORM:**  
- `Microsoft.EntityFrameworkCore` (9.0.0)  
- `Microsoft.EntityFrameworkCore.SqlServer` (9.0.0)  
- `Microsoft.EntityFrameworkCore.Design` (9.0.0)  
- `Microsoft.EntityFrameworkCore.Tools` (9.0.0)

**Code Generation:**  
- `Microsoft.VisualStudio.Web.CodeGeneration.Design` (8.0.7)

**API Documentation:**  
- `Swashbuckle.AspNetCore` (6.6.2) for Swagger integration

**Email Services:**  
- `MailKit` (4.10.0)

---

## Frontend Technologies

**Framework:**  
- **Angular** (Version 17.0.8)

**UI Libraries & Styling:**  
- `@angular/material` (16.2.11)  
- `@angular/cdk` (16.2.11)  
- **Bootstrap** (5.3.1)

**Routing & Forms:**  
- `@angular/router` (17.0.8)  
- `@angular/forms` (17.0.8)

**Data Visualization:**  
- `chart.js` (4.4.0)  
- `ng2-charts` (5.0.3)

**PDF & Image Export:**  
- `jspdf` (2.5.2)  
- `jspdf-autotable` (3.8.4)  
- `html2canvas` (1.4.1)

**Notifications:**  
- `ngx-toastr` (17.0.2)

**Reactive Extensions:**  
- `rxjs` (7.8.0)

**Zone Management:**  
- `zone.js` (0.14.2)

---

## Development Tools & Environment

**Angular CLI & DevKit:**  
- `@angular/cli` (17.0.8)  
- `@angular-devkit/build-angular` (17.0.8)

**TypeScript:**  
- **TypeScript** (5.2.2)

**Testing Tools:**  
- `Jasmine` (4.6.0)  
- `Karma` (6.4.0)  
- `karma-jasmine` (5.1.0)  
- `karma-chrome-launcher` (3.2.0)  
- `karma-coverage` (2.2.0)  
- `karma-jasmine-html-reporter` (2.1.0)

**Code Generation & Scaffolding:**  
- `Microsoft.VisualStudio.Web.CodeGeneration.Design` (8.0.7)

---

## Summary
The Courier Delivery Management System integrates **ASP.NET Core Web API** for a robust backend and **Angular** for a dynamic, responsive frontend. The project leverages modern libraries for authentication, data visualization, PDF generation, and UI design, ensuring a feature-rich and efficient platform.

---

## Getting Started

1. **Clone the repository:**  
   ```bash
   git clone https:https://github.com/arafat-cse/CourierDeliveryManagementSystem.git
   ```

2. **Navigate to the project directory:**  
   ```bash
   cd CourierDeliveryManagementSystem
   ```

3. **Setup Backend:**  
   - Navigate to the API folder and run:
     ```bash
     dotnet restore
     dotnet run
     ```

4. **Setup Frontend:**  
   - Navigate to the Angular project folder and run:
     ```bash
     npm install
     ng serve
     ```

5. **Access the Application:**  
   Open your browser and go to `http://localhost:4200` for the frontend and `http://localhost:4200/swagger` for API documentation.

---

## License
This project is licensed under the [MIT License](LICENSE).

---

## Contact
For further information or inquiries, please contact [arafat.dev61@gmail.com](mailto:arafat.dev61@gmail.com).
