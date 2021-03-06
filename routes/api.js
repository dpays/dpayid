const express = require('express');
const { authenticate, verifyPermissions } = require('../helpers/middleware');
const { encode } = require('dpayjs/lib/auth/memo');
const { issueUserToken } = require('../helpers/token');
const { getUserMetadata, updateUserMetadata } = require('../helpers/metadata');
const { getErrorMessage } = require('../helpers/operation');
const { isOperationAuthor } = require('../helpers/operation');
const config = require('../config.json');

const router = express.Router(); // eslint-disable-line new-cap

/** Update user_metadata */
router.put('/me', authenticate('app'), async (req, res) => {
  const scope = req.scope.length ? req.scope : config.authorized_operations;
  let accounts;
  try {
    accounts = await req.dpay.api.getAccountsAsync([req.user]);
  } catch (err) {
    req.log.error(err, 'me: dPayAPI request failed', req.user);
    res.status(501).send('dPayAPI request failed');
    return;
  }
  const { user_metadata } = req.body;

  if (typeof user_metadata === 'object') { // eslint-disable-line camelcase
    /** Check object size */
    const bytes = Buffer.byteLength(JSON.stringify(user_metadata), 'utf8');
    if (bytes <= config.user_metadata.max_size) {
      /** Save user_metadata object on database */
      req.log.error(`Store object for ${req.user} (size ${bytes} bytes)`);
      try {
        await updateUserMetadata(req.proxy, req.user, user_metadata);
      } catch (err) {
        req.log.error(err, 'me: updateMetadata failed', req.user);
        res.status(501).send('request failed');
        return;
      }

      res.json({
        user: req.user,
        _id: req.user,
        name: req.user,
        account: accounts[0],
        scope,
        user_metadata,
      });
      return;
    }
    res.status(413).json({
      error: 'invalid_request',
      error_description: `User metadata object must not exceed ${config.user_metadata.max_size / 1000000} MB`,
    });
    return;
  }
  res.status(400).json({
    error: 'invalid_request',
    error_description: 'User metadata must be an object',
  });
  return;
});

/** Get my account details */
router.all('/me', authenticate(), async (req, res) => {
  const scope = req.scope.length ? req.scope : config.authorized_operations;
  let accounts;
  try {
    accounts = await req.dpay.api.getAccountsAsync([req.user]);
  } catch (err) {
    req.log.error(err, 'me: dPayAPI request failed', req.user);
    res.status(501).send('dPayAPI request failed');
    return;
  }
  let userMetadata;
  try {
    userMetadata = req.role === 'app'
    ? await getUserMetadata(req.proxy, req.user)
    : undefined;
  } catch (err) {
    req.log.error(err, 'me: couldnt parse metadata failed', req.user);
    res.status(501).send('request failed');
    return;
  }
  res.json({
    user: req.user,
    _id: req.user,
    name: req.user,
    account: accounts[0],
    scope,
    user_metadata: userMetadata,
  });
  return;
});

/** Broadcast transaction */
router.post('/broadcast', authenticate('app'), verifyPermissions, async (req, res) => {
  const scope = req.scope.length ? req.scope : config.authorized_operations;
  const { operations } = req.body;

  let scopeIsValid = true;
  let requestIsValid = true;
  let invalidScopes = '';
  operations.forEach((operation) => {
    /** Check if operation is allowed */
    if (scope.indexOf(operation[0]) === -1) {
      scopeIsValid = false;
      invalidScopes += (invalidScopes !== '' ? ', ' : '') + operation[0];
    }
    /** Check if author of the operation is user */
    if (!isOperationAuthor(operation[0], operation[1], req.user)) {
      requestIsValid = false;
    }
  });

  if (!scopeIsValid) {
    res.status(401).json({
      error: 'invalid_scope',
      error_description: `The access_token scope does not allow the following operation(s): ${invalidScopes}`,
    });
  } else if (!requestIsValid) {
    res.status(401).json({
      error: 'unauthorized_client',
      error_description: `This access_token allow you to broadcast transaction only for the account @${req.user}`,
    });
  } else {
    req.log.error(`Broadcast transaction for @${req.user} from app @${req.proxy}`);
    req.dpay.broadcast.send(
      { operations, extensions: [] },
      { posting: process.env.BROADCASTER_POSTING_WIF },
      (err, result) => {
        /** Save in database the operations broadcasted */
        if (!err) {
          res.json({ result });
        } else {
          req.log.error(err, 'Transaction broadcast failed', operations);
          res.status(500).json({
            error: 'server_error',
            error_description: getErrorMessage(err) || err.message || err,
          });
        }
      }
    );
  }
});

router.all('/login/challenge', async (req, res) => {
  const username = req.query.username;
  const role = ['posting', 'active', 'owner'].includes(req.query.role) ? req.query.role : 'posting';
  const token = issueUserToken(username);
  let accounts;
  try {
    accounts = await req.dpay.api.getAccountsAsync([username]);
  } catch (err) {
    req.log.error(err, 'challenge: dPayAPI request failed', username);
    res.status(501).send('dPayAPI request failed');
    return;
  }
  const keyAuths = accounts[0][role].key_auths;
  const codes = keyAuths.map(keyAuth =>
    encode(process.env.BROADCASTER_POSTING_WIF, keyAuth[0], `#${token}`)
  );
  res.json({
    username,
    codes,
  });
  return;
});

/**
  Revoke app tokens for a user
  If appId is not provided all the tokens for all the apps are revoked
*/
router.all('/token/revoke/:type/:clientId?', authenticate('user'), async (req, res) => {
  const { clientId, type } = req.params;
  const { user } = req;
  const where = {};

  if (type === 'app' && clientId) {
    const app = await req.db.apps.findOne({ where: { client_id: clientId } });
    if (app.owner === user) {
      where.client_id = clientId;
    }
  } else if (type === 'user') {
    where.user = user;
    if (clientId) {
      where.client_id = clientId;
    }
  }

  if (
    (type === 'user' && (where.user || where.client_id)) ||
    (type === 'app' && where.client_id)
  ) {
    await req.db.tokens.destroy({ where });
  }

  res.json({ success: true });
});

module.exports = router;
