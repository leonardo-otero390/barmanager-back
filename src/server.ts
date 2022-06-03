/* eslint-disable no-console */
import app from './app.js';

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
  if (process.env.NODE_ENV === 'test') {
    console.log('at test mode');
  }
});
