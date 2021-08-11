import express = require('express');
import { authGuard } from '#/core/guards/auth.guard';
import { databaseGuard } from '../guards/database.guard';
import { channelController } from '../controllers/channel.controller';

const app = express();
app.disable('x-powered-by');

app.get('/owned', databaseGuard, authGuard, channelController.getOwned());
app.get('/notify', databaseGuard, channelController.notify());
app.post('/', databaseGuard, authGuard, channelController.create());
app.patch('/', databaseGuard, authGuard, channelController.update());

export const channelApp = app;
