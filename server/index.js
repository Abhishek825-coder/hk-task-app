const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const knex = require('./db/knex');
const { Model } = require('objection');

const app = express();

app.use(express.static(path.join(__dirname, '../public')));


// Connect Objection to Knex
Model.knex(knex);

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// View engine setup
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

// 🔹 Default Route
app.get('/', (req, res) => {
  res.send("Database connected successfully!");
});


// 🔹 Show combined add-user and add-task form
app.get('/add-both', async (req, res) => {
  try {
    const users = await knex('users').select('id', 'name');
    res.render('addUserAndTask', { users });
  } catch (err) {
    console.error("Error loading users for form:", err);
    res.status(500).send("Error loading form data");
  }
});


// 🔹 Show add-user form
app.get('/add-user', (req, res) => {
  res.render('addUser');
});

// 🔹 Handle add-user form submission
app.post('/add-user', async (req, res) => {
  const { name, email, mobile } = req.body;

  try {
    await knex('users').insert({ name, email, mobile });
    res.send('User added successfully!');
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).send('Error inserting user!');
  }
});

// 🔹 Show add-task form
app.get('/add-task', async (req, res) => {
  try {
    const users = await knex('users').select('id', 'name');
    res.render('addTask', { users });
  } catch (err) {
    res.status(500).send("Error loading users");
  }
});

// 🔹 Handle add-task form submission
app.post('/add-task', async (req, res) => {
  const { task_name, status, user_id } = req.body;

  try {
    await knex('tasks').insert({ task_name, status, user_id });
    res.send("Task added successfully!");
  } catch (error) {
    console.error("Error inserting task:", error);
    res.status(500).send("Error inserting task");
  }
});

// 🔹 Show all users and tasks
app.get('/all-data', async (req, res) => {
  try {
    const users = await knex('users').select('*');

    const tasks = await knex('tasks')
      .join('users', 'tasks.user_id', 'users.id')
      .select(
        'tasks.id',
        'tasks.task_name as task_name',
        'tasks.status',
        'users.name as user_name'
      );

    res.render('dataList', { users, tasks });
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).send("Error fetching data");
  }
});

// Server start
app.listen(3000, () => {
  console.log("Server started at http://localhost:3000");
});
