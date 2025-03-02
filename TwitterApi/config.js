module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "root",
    DB: "testdb",
    dialect: "mysql",
    VAPID_PUBLIC_KEY: "BB2nCOXK_TU4O4KeNXf-diD7JfYO16jwRsE41YSMqP3oRfaLaEtmGPMvmAeUAuGz_tiEy-8vGktbQGXwfzdDGbw",
    VAPID_PRIVATE_KEY: "qIMxAyQpjCTD0-FNNnBsw4tS8r-ohpAVi9DAmakIA0E",
    VAPID_EMAIL: "mailto:XDabdel@gmail.com",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
      
    }
  };