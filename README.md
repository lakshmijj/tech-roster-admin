# Boilerplate for PROG3017 Full Stack Programming with Express Server and MongoDB

This project folder contains the React client side and the Express Server side with MondoDB

## Available Scripts

In the project directory, run command:

### `docker-compose up --build`

Builds Docker images
Spins up the container that runs the local server (React web app)
Spins up the container that runs the Express server (running on Node.js)
Spins up the container that runs the MongoDB server

### `docker compose -f docker-compose-prod.yml up --build`
Builds docker container images for production build
Spins up the container that runs the Express server (running on Node.js) that handles the API requests as well as serves the client side's index.html
Spins up the container that runs the MongoDB server