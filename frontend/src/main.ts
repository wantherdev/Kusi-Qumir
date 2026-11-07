import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { mountDestinationPhotos } from './destination-photos';

bootstrapApplication(App, appConfig)
  .then(async (application) => {
    // The credits are inserted only after Angular has hydrated the server markup.
    await application.whenStable();
    mountDestinationPhotos(document);
  })
  .catch((err) => console.error(err));
