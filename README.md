# ICONIO 

Key name for our new research project dedicated to *Time-Series forecasting by means of Javascript code*.

Our new approach allows to execute many different time-series forecasting methods in parallel using web navigators.

The server only needs to send data to the navigators and receive the best solutions.

## Installing and executing

In order to install:
- Clone this repo
- Execute in your terminal:  `npm install`
- Create a config.js from config.js.template.js
    - You can use locahost as host and 8080 as port if you want to easily execute in your own computer

In order to execute
- You need to *previously install and execute* mongodb (https://www.mongodb.org/)
- Execute in your terminal: `node server`
- Open your web browser (different from Internet Explorer, please) and connect to http://localhost:8080
    - You should change both server and port accordingly to what you write in config.js
