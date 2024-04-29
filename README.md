<h1 align="center">Welcome to Cinema Management 👋❤️</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <img src="https://img.shields.io/badge/npm-%3E%3D10.5.0-blue.svg" />
  <img src="https://img.shields.io/badge/node-%3E%3Dv20.12.0-blue.svg" />
  <a href="https://github.com/basheermulla/Cinema-management-system/blob/main/LICENSE.txt" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/basheermulla/Cinema-management-system" />
  </a>

</p>

## ✨ Project's Title
### Cinema Management
> Management of members' cinema subscription

## ✨ System architecture
<img alt="Version" src="https://github.com/basheermulla/Cinema-management-system/blob/main/client/src/assets/images/SystemArchitecture.drawio.png" />

### My Favorite Movie
![The Shawshank Redemption](https://www.youtube.com/watch?v=zWh3CShX_do)

## ✨ Project Description
### About my application
1.	The cinema management system is a full-stack project designed to manage members’ subscriptions in my cinema.
2.	The architecture of the system is based on MERN Stack development. The backend side consists of two Node JS servers as a REST API (CinemaWS, SubscriptionsWS) that use two external web services to provide main data, 240 movies, and 10 members, the database is based on Mongo DB and includes several collections such as movies, members, subscriptions, messages, conversations and users, and two JSON files inside one of the servers (CinemaWS) that store the users' information and permissions. The frontend side was implemented using JavaScript using advanced features and capabilities of the popular React JS library such as redux toolkit, context, custom hooks, and multiple third-party modules such as formik, yup, framer-motion, moment, date-fns, apexcharts, etc.
3.	This system provides an easy interface and good control for users to manage the members’ subscriptions on my cinema. After logging in, the system navigates to the default page as a dashboard that displays important and statistical data about the system's activity such as the number of movies, the number of online users, the number of subscriptions, a bar graph of the number of subscribers in the current year per month, popular movies, etc.
4.	The main part of the system includes “chat”, “movies”, “subscriptions” and “recommendations” models. The "chat" model is used as a “corporate chat” and allows users to communicate through messages in real time. The “movies” model shows all the movies with their descriptions and allows you to perform all the CRUD operations (create, get, update, and delete movies). The “subscriptions” model shows all members with their previous and future subscriptions, in this model we can manage member's data, add a new subscription, or change a future subscription. The “recommendations” model uses the collaborative-filter approach to offer movie recommendations to a certain member according to similar members.
5.	The last part of the system has a user management component, which displays all system users and their permissions. The permissions include viewing, updating, creating, and deleting actions related to the movie and subscription management system. A user assigned all permissions (view, update, create, delete) of movie and subscription models becomes a user owner and manager which gets additional permissions including view, update, create, and delete operations related to the user model. Only authorized users can log in to the system.
6.	The registration step for a new user is done in two steps, first, the owner must create a new user without a password, second, the user must navigate to the registration page for the first time and register by entering a password, after which a user can enter the system.

### Why to use MERN Stack technologies
> The MERN Stack offers several advantages for building web applications and systems such as: 
1.	Full-stack JavaScript - MERN Stack enables to write both the client-side and server-side code in JavaScript.
2.	Flexibility and Scalability - MongoDB, a NoSQL database, provides flexibility in data modelling and scalability. Node.js, known for its event-driven, non-blocking I/O model, enhances the scalability of server-side code by handling multiple concurrent connections efficiently.
3.	React for UI Components: React.js, a popular JavaScript library for building user interfaces, offers a component-based architecture that facilitates the development of reusable UI components. This modularity enhances code maintainability and reusability, resulting in faster development cycles.
4.	Express.js for Server-side Routing: Express.js, a minimalist web application framework for Node.js, simplifies server-side routing and middleware integration. It provides robust features for handling HTTP requests, defining routes, and managing application logic, thereby accelerating the development of server-side components.
5.	JSON-based Communication: MERN Stack utilizes JSON (JavaScript Object Notation) for data interchange between the client and server, offering a lightweight and efficient communication mechanism. This facilitates seamless integration between frontend and backend components, enabling real-time data updates and enhancing user experience.

## ✨ Prerequisites
> Before you begin, ensure you have met the following requirements:
a.	Node.js: The project requires Node.js to be installed on your system (node >=v20.12.0).
b.	MongoDB: The project relies on MongoDB for storing data.
c.	npm (Node Package Manager): npm typically comes with Node.js installation. You can verify if npm is installed by running the following command in your terminal: npm -v (npm >=10.5.0).
d.	Git: Make sure you have Git installed on your system so you can clone this repository. 

## ✨ How to Install the Project
> Follow these steps to install and run the project:
1.	Clone the repository:
```sh
git clone https://github.com/basheermulla/Cinema-management-system.git
```
2.	Installing a Concurrently module, and some scripts which run both the backend and frontend:
```sh
cd Cinema-management-system
```
```sh
npm install
```
3.	Installing the backend:
```sh
cd Cinema-management-system/server/SubscriptionsWS
```
```sh
npm install
```
```sh
cd Cinema-management-system/server/CinemaWS
```
```sh
npm install
```
4.	Installing the frontend:
```sh
cd client
```
```sh
npm install
```

## ✨ Configuration
> Configuration, before running the project, make sure to set up the environment variables configurations:
1.	Configure a MONGO_URL on the .env file into both SubscriptionsWS and CinemaWS server:
```sh
MONGODB_URL=<your_mongodb_url>
```
2.	Configure the environment mode (development / production) on the .env file into a CinemaWS server:
```sh
NODE_ENV=development
```
3. Configure the environment mode (development / production) on the .env file into a client:
```sh
VITE_APP_MODE=development
```

### ✨ Usage
1. Running the project on the development environment:
```sh
cd Cinema-management-system
```
```sh
npm run dev
```
2.	Running the project on the production environment:
```sh
cd Cinema-management-system
```
```sh
npm run start
```

## ✨ Author
* Basheer mulla
* LinkedIn: [@https:\/\/www.linkedin.com\/in\/basheer-mulla-678069ba\/](https://linkedin.com/in/https:\/\/www.linkedin.com\/in\/basheer-mulla-678069ba\/)

## 🤝 Contributing
Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/basheermulla/Cinema-management-system/issues)

## ✨ Show your support
> Give a ⭐️ if this project helped you!

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details [LICENSE](https://github.com/basheermulla/Cinema-management-system/blob/main/LICENSE.txt)

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
