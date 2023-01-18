const uuid = require('uuid')
const { customAlphabet } = require('nanoid')

function initQRSession() {
  const info = {
    authParams: {
      clientId: process.env.SINGPASS_LOGIN_CLIENT_ID,
      redirectUri: process.env.SINGPASS_LOGIN_REDIRECT_URI,
      scope: 'openid',
      responseType: 'code',
    },
    authParamsSupplier: {
      state: uuid.v4(),
      nonce: uuid.v4(),
      codeChallenge: customAlphabet(
        '0123456789abcdefghijklmnopkrstuvwxyzABCDEFGHIJKLMNOPKRSTUVWXYZ',
        43,
      )(),
      codeChallengeMethod: 'S256',
    },
    additionalOptions: {
      renderDownloadLink: true,
    },
  }

  return info
}

async function getIdTokenFromSingpass(code, state) {
  return {
    idToken: '',
    payload: {},
  }
}

module.exports = { initQRSession, getIdTokenFromSingpass }
