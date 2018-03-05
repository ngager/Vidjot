# Vidjot

Vidjot is a small Node/Express application for saving video ideas.

### Running Code
To run this application, clone the repository then run the commands below in the main directory. Once finished, open a up browser and navigate to ``` localhost:5000 ```

#### Running With Node
```
$ npm install
$ node app.js 
```

#### Running With Nodemon
Nodemon is a utility that acts as a live server and allows any changes made in a node application to restart the server and the application with the loaded changes.

```
$ npm install
$ nodemon
```

### Deploying to Heroku

#### Add A Start Script
Add a start script to package.json so that Heroku can run ```npm start```

```
"scripts": {
    "start": "node app.js"
}
```

#### Modify Port
Heroku decides what port to use, whereas when running locally we can use port 5000. Because of this the port in ```app.js``` needs to be modified to pick up the assigned port from Heroku.
```
const port = process.env.PORT || 5000;
```

#### mLab
Add a deployment creator using mLab and connect using a driver via the standard MongoDB URI that is provided
```
mongodb://<dbuser>:<dbpassword>@ds231725.mlab.com:31725/vidjot-prod
```
