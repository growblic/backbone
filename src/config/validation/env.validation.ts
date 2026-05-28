import * as Joi from 'joi';

export const envValidationSchema =
  Joi.object({
    // =====================================================
    // ✅ APP
    // =====================================================

    NODE_ENV: Joi.string()
      .valid(
        'development',
        'production',
        'test',
      )
      .default('development'),

    PORT: Joi.number().default(3000),

    // =====================================================
    // ✅ DATABASE
    // =====================================================

    DATABASE_URL:
      Joi.string().required(),

    // =====================================================
    // ✅ JWT
    // =====================================================

    JWT_ACCESS_SECRET:
      Joi.string().required(),

    JWT_REFRESH_SECRET:
      Joi.string().required(),

    JWT_ACCESS_EXPIRES_IN:
      Joi.string().required(),

    JWT_REFRESH_EXPIRES_IN:
      Joi.string().required(),

    // =====================================================
    // ✅ REDIS
    // =====================================================

    REDIS_HOST:
      Joi.string().required(),

    REDIS_PORT:
      Joi.number().required(),

    // =====================================================
    // ✅ SMS
    // =====================================================

    SMS_GATEWAY_HUB_BASE_URL:
      Joi.string().required(),

    SMS_GATEWAY_HUB_SEND_SMS_PATH:
      Joi.string().required(),

    SMS_GATEWAY_HUB_API_KEY:
      Joi.string().required(),

    SMS_GATEWAY_HUB_SENDER_ID:
      Joi.string().required(),

    SMS_ENTITY_ID:
      Joi.string().required(),

    SMS_TEMPLATE_LOGIN_ID:
      Joi.string().required(),

    SMS_TEMPLATE_REGISTRATION_ID:
      Joi.string().required(),

    SMS_TEMPLATE_RESET_PASSWORD_ID:
      Joi.string().required(),
  });