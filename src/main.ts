import { connectToDB, mongooseConnection } from './database';
import app from './app';
const PORT = process.env.PORT;


connectToDB()
  .then(async () => {
    const db = await mongooseConnection();
    db.once('open', async function () {
      console.log('Connected to the database.');
    });
  })
  .catch((err) => {
    console.error(err);
  });

app.listen(PORT, function () {
  console.log(`server started on port ${PORT}`);
});
