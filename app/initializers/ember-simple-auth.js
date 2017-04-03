import ENV from '../config/environment';
import Configuration from 'ember-simple-auth/configuration';
import setupSession from 'ember-simple-auth/initializers/setup-session';
import setupSessionService from 'ember-simple-auth/initializers/setup-session-service';

export default {
  name: 'ember-simple-auth',
  initialize(registry) {
    let config   = ENV['ember-simple-auth'] || {};
    Configuration.load(config);

    setupSession(registry);
    setupSessionService(registry);
  }
};
