const { MongoClient, ObjectID } = require("mongodb");

const connectionUrl = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(connectionUrl, { useNewUrlParser: true }, (err, client) => {
  if (err) return console.log(err);
  const db = client.db(databaseName);

  /*
  db.collection("tasks").insertMany(
    [
      {
        description: "Complete NodeJS Course",
        completed: false,
      },
      {
        description: "Watch PostgreSQL Connection",
        completed: false,
      },
      {
        description: "Revise Weather,Task-manager,Chatapp",
        completed: false,
      },
      {
        description: "Make some basic full stack app",
        completed: false,
      },
      {
        description: "Make Triangle app",
        completed: false,
      },
      {
        description: "Submit square app",
        completed: false,
      },
    ],
    (err, res) => {
      if (err) return console.log(err);
      console.log(res.acknowledged);
    }
  );
  */

  db.collection("tasks")
    .updateMany(
      {
        completed: true,
      },
      {
        $set: {
          completed: false,
        },
      }
    )
    .then((result) => console.log(result))
    .catch((err) => console.log(err));

  /*db.collection("tasks")
    .find({ completed: true })
    .toArray((err, res) => {
      if (err) return console.log(err);
      console.log(res);
    });*/
});
