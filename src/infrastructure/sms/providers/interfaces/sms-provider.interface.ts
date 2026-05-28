export interface SendSmsPayload {
  phone: string;

  message: string;

  templateId?: string;

  entityId?: string;

  metadata?: Record<string, any>;
}

export interface SmsProviderResponse {
  success: boolean;

  provider: string;

  messageId?: string;

  error?: string;
}

export interface SmsProvider {
  readonly providerName: string;

  sendSms(
    payload: SendSmsPayload,
  ): Promise<SmsProviderResponse>;
}