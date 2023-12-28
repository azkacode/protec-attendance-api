import express from 'express';
import config from './config';
import Loaders from './loader';

const app = express();
const PORT = config.port;
const LoaderService = new Loaders(app);
LoaderService.load();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
