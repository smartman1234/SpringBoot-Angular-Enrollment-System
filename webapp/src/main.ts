import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { akitaProviders } from "./app/shared/store/app-store.module";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic(akitaProviders).bootstrapModule(AppModule)
  .catch(err => console.error(err));
