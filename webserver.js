//*******NORMAL INTEGRATION**********//

const dotenv = require('dotenv').config()
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var path = require('path')
const {
  initQRSession,
  getIdTokenFromSingpass,
} = require('./services/singpass-login')

app.use(bodyParser.json())
app.use(function (req, res, next) {
  // res.setHeader(
  //   'Content-Security-Policy',
  //   "default-src 'self'; script-src 'self' 'unsafe-inline' https://*.singpass.gov.sg; connect-src 'self' https://*.singpass.gov.sg; style-src 'self' 'unsafe-inline' https://*.singpass.gov.sg; img-src 'self' https://*.singpass.gov.sg data:; font-src https://fonts.gstatic.com;",
  // )
  next()
})
app.use(express.static('public'))

/*****************
 * Routes - BEGIN
 *****************/
app.get('/init-qr-session', (req, res) => {
  const data = initQRSession()
  res.status(200).json(data)
})

app.post('/auth-code', async (req, res) => {
  const { code, state } = req.body

  const { success, data } = await getIdTokenFromSingpass(code, state)
  console.log('success: ', success)
  console.log('data: ', data)

  if (success) {
    res.status(200).json({
      success,
      data: {
        ...data,
        access_token: 'this is access_token',
        refresh_token: 'this is refresh_token',
      },
    })
  } else {
    res.status(403).send()
  }
})

/*****************
 * Routes - END
 *****************/

//Listen to server at port 8080, Default IP 127.0.0.1
var server = app.listen(3300, '127.0.0.1', function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})
