export default () => ({
  sms: {
    baseUrl:
      process.env.SMS_GATEWAY_HUB_BASE_URL,

    sendSmsPath:
      process.env.SMS_GATEWAY_HUB_SEND_SMS_PATH,

    apiKey:
      process.env.SMS_GATEWAY_HUB_API_KEY,

    senderId:
      process.env
        .SMS_GATEWAY_HUB_SENDER_ID,

    entityId:
      process.env.SMS_ENTITY_ID,

    loginTemplateId:
      process.env.SMS_TEMPLATE_LOGIN_ID,

    registrationTemplateId:
      process.env
        .SMS_TEMPLATE_REGISTRATION_ID,

    resetPasswordTemplateId:
      process.env
        .SMS_TEMPLATE_RESET_PASSWORD_ID,
  },
});