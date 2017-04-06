/* jshint expr:true */
import {
    describe,
    it,
    beforeEach,
    afterEach
} from 'mocha';
import $ from 'jquery';
import { expect } from 'chai';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';
import { invalidateSession, authenticateSession } from '../helpers/ember-simple-auth';
import { Response } from 'ember-cli-mirage';

describe('Acceptance: Signin', function() {
  let application;

  beforeEach(function() {
    application = startApp();
  });

  afterEach(function() {
    destroyApp(application);
  });

  it('redirects if already authenticated', function() {
    server.create('user');

    authenticateSession(application);

    visit('/signin');
    andThen(() => {
      expect(currentURL(), 'current url').to.equal('/');
    });
  });

  describe('when attempting to signin', function() {
    beforeEach(function() {
      server.create('user');

      server.post('/token', function(schema, { requestBody }) {
        /* eslint-disable camelcase */
        let {
            grant_type: grantType,
            username,
            password
        } = $.deparam(requestBody);

        expect(grantType, 'grant type').to.equal('password');
        expect(username, 'username').to.equal('test@example.com');

        if (password === 'testpass') {
          return {
            access_token: '5JhTdKI7PpoZv4ROsFoERc6wCHALKFH5jxozwOOAErmUzWrFNARuH1q01TYTKeZkPW7FmV5MJ2fU00pg9sm4jtH3Z1LjCf8D6nNqLYCfFb2YEKyuvG7zHj4jZqSYVodN2YTCkcHv6k8oJ54QXzNTLIDMlCevkOebm5OjxGiJpafMxncm043q9u1QhdU9eee3zouGRMVVp8zkKVoo5zlGMi3zvS2XDpx7xsfk8hKHpUgd7EDDQxmMueifWv7hv6n',
            expires_in: 3600,
            refresh_token: 'XP13eDjwV5mxOcrq1jkIY9idhdvN3R1Br5vxYpYIub2P5Hdc8pdWMOGmwFyoUshiEB62JWHTl8H1kACJR18Z8aMXbnk5orG28br2kmVgtVZKqOSoiiWrQoeKTqrRV0t7ua8uY5HdDUaKpnYKyOdpagsSPn3WEj8op4vHctGL3svOWOjZhq6F2XeVPMR7YsbiwBE8fjT3VhTB3KRlBtWZd1rE0Qo2EtSplWyjGKv1liAEiL0ndQoLeeSOCH4rTP7',
            token_type: 'Bearer'
          };
        } else {
          return new Response(401, {}, {
            errors: [{
              errorType: 'UnauthorizedError',
              message: 'Invalid Password'
            }]
          });
        }
          /* eslint-enable camelcase */
      });
    });

    it('errors correctly', function() {
      invalidateSession(application);

      visit('/signin');

      andThen(() => {
        expect(currentURL(), 'signin url').to.equal('/signin');

        expect(find('input[name="identification"]').length, 'email input field')
            .to.equal(1);
        expect(find('input[name="password"]').length, 'password input field')
            .to.equal(1);
      });

      click('.ffg-btn-blue');

      andThen(() => {
        expect(find('.form-group.error').length, 'number of invalid fields')
            .to.equal(2);

        expect(find('.main-error').length, 'main error is displayed')
            .to.equal(1);
      });

      fillIn('[name="identification"]', 'test@example.com');
      fillIn('[name="password"]', 'invalid');
      click('.ffg-btn-blue');

      andThen(() => {
        expect(currentURL(), 'current url').to.equal('/signin');

        expect(find('.main-error').length, 'main error is displayed')
            .to.equal(1);

        expect(find('.main-error').text().trim(), 'main error text')
              .to.equal('Invalid Password');
      });
    });

    it('submits successfully', function() {
      invalidateSession(application);

      visit('/signin');

      andThen(() => {
        expect(currentURL(), 'current url').to.equal('/signin');
      });

      fillIn('[name="identification"]', 'test@example.com');
      fillIn('[name="password"]', 'testpass');
      click('.ffg-btn-blue');

      andThen(() => {
        expect(currentURL(), 'currentURL').to.equal('/');
      });
    });
  });
});