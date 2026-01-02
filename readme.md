# Weather App

A client-side web application that provides weather information with city autocomplete, search, and filtering features. Built with modern JavaScript (ES modules) and focused on data handling, usability, and maintainability.

---

## 🌐 Live Application  
https://projectfall.click

## 🧪 Test Runner (Jasmine)  
https://projectfall.click/site/SpecRunner.html

---

## 🧩 What the App Does

- Allows users to search for cities using an autocomplete interface
- Retrieves weather data from external APIs
- Displays dynamic, data-driven weather results
- Stores recent searches and UI state using `localStorage` and `sessionStorage`
- Supports client-side filtering and interactive UI updates without page reloads

---

## 🛠️ Technologies Used

- JavaScript (ES6+, ES modules)
- HTML5 / CSS3
- Fetch API, async/await
- Integration of multiple external web APIs with dependent request flows
- JSON data processing
- localStorage / sessionStorage
- Jasmine (unit testing)

---

## 📊 Data Handling & Validation

- City metadata is loaded from a local JSON dataset
- User input is validated before triggering API requests
- API responses are validated and transformed before rendering
- Basic error handling is implemented for invalid input and failed requests
- External API responses are normalized and combined before being rendered in the UI
- Client-side data processing supports fast iteration and exploratory user interaction

---

## 🚀 Local Setup

This project uses **JavaScript modules** (`type="module"`) and the **Fetch API**, so it must be run through a local web server.  
Opening files directly using `file://` will not work due to browser security restrictions.

### Requirements
- Modern browser (Chrome, Edge, Firefox)
- Local web server

### Option: VS Code Live Server

1. Open the project folder in **VS Code**
2. Install the **Live Server** extension
3. Right-click `index.html`
4. Select **“Open with Live Server”**
5. Navigate to the provided local URL

---

## 🧪 Running Tests (Jasmine)

1. Start the local server
2. Open `http://127.0.0.1:5500/site/SpecRunner.html`
3. Jasmine tests will run automatically in the browser

---

## 🔐 Important Notes

- ES modules require a server environment
- Fetch requests are subject to CORS restrictions
- Local JSON data must be served over HTTP

---

## 🔮 Future Improvements

- Move API logic to a lightweight server-side layer
- Add more advanced input validation and accessibility enhancements
- Improve performance for large datasets
- Add persistent user preferences and saved locations
