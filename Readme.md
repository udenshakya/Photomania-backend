# Pinterest

This is a pinterest clone project that allows user to explore interesing post shared by others and share your posts on the platform.

## Table of contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisite](#prerequisite)
- [Installation](#installation)
- [ENV Variables](#env-variables)
- [Docker](#docker)
- [Author](#author)

## Features

- Register and login to explore new world
- Add your posts with images and short description of post
- Explore other post and add your own posts
- Full CRUD functionality of posts

## Technologies Used

- **Express** - fast, unopinionated, minimalist web framework for Node.js.
- **TypeORM** - ORM for SQL Database
- **Node** - free, open-source, cross-platform JavaScript runtime environment
- **JWT** - for authentication, authorization, and information exchange

## Prerequisite

1. Xampp, SQL Workbench or other database
2. Nodejs must be installed

## Installation

Pinterest requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the server.

```sh
git clone // link
cd server  // for backend
npm i
npm run dev  //todo concurrent with frontend
```

## ENV Variables

Make Sure to Create a .env file in root directory and add appropriate variables in order to use the app.

| Env Name              |         Value          |              Description               |
| --------------------- | :--------------------: | :------------------------------------: |
| PORT                  |          8000          |      The server runs on port 8000      |
| DB_NAME               |     Database name      |    The name of the database created    |
| DB_USERNAME           |     Your username      |       Username for the database        |
| DB_PASSWORD           |     Your password      |      The password of the database      |
| DB_HOST               |       localhost        |          The name of the host          |
| DB_PORT               |          3306          |     The port the database runs on      |
| JWT_SECRET            |    Your secret key     | Secret key used for JWT authentication |
| CLOUDINARY_NAME       |  Your cloudinary name  |         Cloudinary cloud name          |
| CLOUDINARY_API_KEY    |  Your cloudinary key   |           Cloudinary API key           |
| CLOUDINARY_API_SECRET | Your cloudinary secret |         Cloudinary API secret          |

## Docker

Pinterest is very easy to install and deploy in a Docker container.

By default, the Docker will expose port 8000, so change this within the
Dockerfile if necessary. When ready, simply use the Dockerfile to
build the image.

```sh
cd server
docker compose up --build
```

Once done, run the Docker image and map the port to whatever you wish on
your host. In this example, we simply map port 8000 of the host to
port 8080 of the Docker (or whatever port was exposed in the Dockerfile):

Verify the deployment by navigating to your server address in
your preferred browser.

```sh
127.0.0.1:8000
```

## Author

**Facebook**: [Uden Shakya](https://www.facebook.com/uden.shakya.7/)

**Linkedin**: [Uden Shakya](https://www.linkedin.com/in/uden-shakya-1749792a7/)
