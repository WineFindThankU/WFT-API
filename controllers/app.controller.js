import { findVersion, createVersion } from '../services/app.service.js'

export const ping = async (req, res) => {
  return res.send('pong')
}

export const appVersion = async (req, res) => {
  const ios = await findVersion('IOS')
  const android = await findVersion('ANDROID')

  var iosVersion = ios ? ios.vs_version : ''
  var iosForce = ios ? ios.vs_force : false

  var androidVersion = android ? android.vs_version : ''
  var androidForce = android ? android.vs_force : false

  return res.status(200).json({
    statusCode: 200,
    message: '버전 조회 성공',
    data: {
      ios: {
        version: iosVersion,
        force: iosForce,
      },
      android: {
        version: androidVersion,
        force: androidForce,
      },
    },
  })
}

export const newVersion = async (req, res) => {
  const { os, version, force } = req.body

  await createVersion(os, version, force)

  return res.status(201).json({
    statusCode: 201,
    message: '버전 추가 성공',
  })
}
