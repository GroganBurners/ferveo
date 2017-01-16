module.exports = {
  development: {
    port: 3000,
    baseUrl: 'http://devbox.example.com:3000',
    db: 'mongodb://localhost/local',
    sessionName: 'test',
    logLevel: 'debug',
    secure: {
        privateKey: '37LvDSm4XvjYOh9Y',
        cookieSecret: 'cookie_secret',
        tokenExpiry: 1 * 30 * 1000 * 60 //1 hour
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackPath: '/auth/google/callback'
    },
    sauceLabs: {
      username: process.env.SAUCE_USERNAME,
      accessKey: process.env.SAUCE_ACCESS_KEY
    },
    mail: {
      from: {
        name: 'Grogan Burner Services 👥',
        address: process.env.MAIL_USER
      },
      server: 'smtp.gmail.com',
      port: 465,
      username: process.env.MAIL_USER,
      password: process.env.MAIL_PASS
    },
    sms: {
      from: 'GrogBurners',
      username: process.env.SMS_USER,
      password: process.env.SMS_PASS
    }
  },
  production: {
    port: 3000,
    baseUrl: 'https://groganburners.ie',
    db: 'mongodb://localhost/gbs',
    sessionName: 'test',
    logLevel: 'info',
    secure: {
        privateKey: process.env.GBS_PRIVATE_KEY,
        cookieSecret: process.env.GBS_COOKIE_SECRET,
        tokenExpiry: 1 * 30 * 1000 * 60 //1 hour
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackPath: '/auth/google/callback'
    },
    sauceLabs: {
      username: process.env.SAUCE_USERNAME,
      accessKey: process.env.SAUCE_ACCESS_KEY
    },
    mail: {
      from: {
        name: 'Grogan Burner Services 👥',
        address: process.env.MAIL_USER
      },
      server: 'smtp.gmail.com',
      port: 465,
      username: process.env.MAIL_USER,
      password: process.env.MAIL_PASS
    },
    sms: {
      from: 'GrogBurners',
      username: process.env.SMS_USER,
      password: process.env.SMS_PASS
    }
  },
  test: {
    port: 3000,
    baseUrl: 'http://devbox.example.com:3000',
    db: 'mongodb://localhost/test',
    sessionName: 'test',
    logLevel: 'error',
    secure: {
        privateKey: '37LvDSm4XvjYOh9Y',
        cookieSecret: 'cookie_secret',
        tokenExpiry: 1 * 30 * 1000 * 60 //1 hour
    },
    google: {
      clientId: 'test',
      clientSecret: 'test',
      callbackPath: '/auth/google/callback'
    },
    sauceLabs: {
      username: process.env.SAUCE_USERNAME,
      accessKey: process.env.SAUCE_ACCESS_KEY
    },
    mail: {
      from: {
        name: 'Grogan Burner Services 👥',
        address: 'test@example.com'
      },
      server: 'smtp.gmail.com',
      port: 465,
      username: 'test@example.com',
      password: 'test'
    },
    sms: {
      from: 'GrogBurners',
      username: 'test',
      password: 'test'
    }
  }
}
