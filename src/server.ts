/* eslint-disable no-console */
import app from './app.js';

app.listen(5000, () => {
  console.log(
    `Server is listening on port 5000 at ${process.env.NODE_ENV} mode`
  );
});
