import * as React from 'react';
import { PiletApi } from 'piral-appshell';
import DCIPage from './DCIPage';
import { DCIPageMenu } from './DCIPageMenu';

export function setup(app: PiletApi) {
  app.registerMenu(DCIPageMenu);
  app.registerPage('/DCIPage', DCIPage);
  app.showNotification('Hello from Piral!', {
    autoClose: 2000,
  });
  app.registerTile(() => <div>DC Import</div>, {
    initialColumns: 2,
    initialRows: 1,
  });
}
