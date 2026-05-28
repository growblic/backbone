export const SMS_CONSTANTS = {
  OTP: {
    EXPIRY_SECONDS: 300,

    RESEND_COOLDOWN_SECONDS: 60,

    MAX_PER_HOUR: 5,

    MAX_VERIFY_ATTEMPTS: 5,
  },

  REDIS_KEYS: {
    OTP_CODE: 'otp:code',

    OTP_RESEND: 'otp:resend',

    OTP_HOURLY_LIMIT:
      'otp:hourly-limit',

    OTP_VERIFY_ATTEMPTS:
      'otp:verify-attempts',
  },
}; 