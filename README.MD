##### Deployment on Heroku
- remove any existing git file using rm -rf .git

- check for process.env.PORT

- set up dummy get route to ensure everything is working
- specify node version on package.json
```js
"engines":{
    "node": "16.x"
  }
```
- Change nodemon app.js to node app.js in start command
- setup procfile
```js
web: node app.js
```
- setup .gitignore
```js
/node_modules
.env
```
###### working with git
- git init
