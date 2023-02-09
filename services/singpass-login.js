const uuid = require('uuid')
const { customAlphabet } = require('nanoid')
const { Singpass } = require('@govtechsg/singpass-myinfo-oidc-helper')
const privatekeys = require('../config/privatekeys')

const oidcHelper = new Singpass.NdiOidcHelper({
  oidcConfigUrl: process.env.SINGPASS_LOGIN_DISCOVERY_ENDPOINT,
  clientID: process.env.SINGPASS_LOGIN_CLIENT_ID,
  redirectUri: process.env.SINGPASS_LOGIN_REDIRECT_URI,
  jweDecryptKey: {
    key: privatekeys['jwe-decrypt-key'],
    alg: 'ES256',
    format: 'pem',
  },
  clientAssertionSignKey: {
    key: privatekeys['client-assertion-sign-key'],
    alg: 'ES256',
    format: 'pem',
  },
  // proxyConfig?: AxiosProxyConfig;
})

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
  try {
    const tokenResponse = await oidcHelper.getTokens(code)
    console.log('response: ', tokenResponse)
    const tokenPayload = await oidcHelper.getIdTokenPayload(tokenResponse)
    const data = oidcHelper.extractNricAndUuidFromPayload(tokenPayload)
    return {
      success: true,
      data,
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      data: null,
    }
  }
}

module.exports = { initQRSession, getIdTokenFromSingpass }
