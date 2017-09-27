## Readable App

Readable app is a comment and content webapp that allows users to post content to predefined categories, comment on their posts and other users' posts, and vote on posts and comments. Users will also be able to edit and delete posts and comments.

## Software Organization
```
+--public/
 |-- index.html - DO NOT MODIFY
 |-- favicon.ico - React Icon.
+-- src/
 +-- actions/ - Folder containing actions in redux store.
  |-- index.js - Actions in redux store.
 +-- components/ - Folder containing actions in redux store.
  |-- App.js - Outside skeleton of the webapp.
  |-- CategoryCol.js - Component displaying categorie titles.
  |-- Category.js - Component displaying a particular category and its posts.
  |-- Comments.js - Component displaying comments of a post.
  |-- Home.js - Component displaying the default home page (i.e. all the categories and all the posts).
  |-- Nav.js - Navigation menu (in breadcrumb format).
  |-- NewComment.js - Component displaying a new comment form.
  |-- PostCol.js - Component displaying the posts of a category.
  |-- Post.js - Component displaying a post detail along with its comments and new comment form.
  |-- Root.js - Root of the webapp containing react routes definitions.
 +-- reducers/ - Folder containing reducers in redux store.
  |-- index.js - Reducers in redux store.
 +-- utils/ - Folder containing various helper files.
  |-- api.js - Contains APIs for accessing the backend server.
  |-- global.js - Global helper functions and const definitions.
 |-- App.css - Styles for your app.
 |-- App.test.js - Used for testing. Provided with Create React App.
 |-- index.js - DOM rendering and initialization of redux store.
 |-- index.css - Global styles. You probably won't need to change anything here.
|-- README.MD - This README file.
|-- package.json - npm package manager file. It's unlikely that you'll need to modify this.
```

## Backend Server

See the instructions on https://github.com/udacity/reactnd-project-readable-starter about how to run the provided backend server.

## Requirements
* Node.js version 6

## Installation
1. Clone the github repository on your local computer with git clone.
2. cd readable
3. Inside readable directory, type npm install to install all the required dependencies.

## Deployment
* Deploying on developement server: Inside the reaaadable directory, type npm start to deploy the app on development server. The app can be accessed via http://localhost:3000/
* Build: npm build to build the app.

## create-react-app

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). You can find more information on how to perform common tasks [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).
