export const smsTemplates = {
  registration: {
    templateId:
      process.env
        .SMS_TEMPLATE_REGISTRATION_ID || '',

    message:
      'Dear user, your Registration OTP is {{OTP}}, team 1500BC',
  },

  login: {
    templateId:
      process.env
        .SMS_TEMPLATE_LOGIN_ID || '',

    message:
      'Dear user, your login OTP is {{OTP}} 1500BC',
  },

  'reset-password': {
    templateId:
      process.env
        .SMS_TEMPLATE_RESET_PASSWORD_ID || '',

    message:
      'Dear user, your OTP is {{OTP}} for forgot password, team 1500BC',
  },
};