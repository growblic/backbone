import {
  Injectable,
  Logger,
} from '@nestjs/common';

import axios from 'axios';

import {
  SmsProvider,
  SendSmsPayload,
  SmsProviderResponse,
} from '@infra/sms/providers/interfaces/sms-provider.interface';

@Injectable()
export class SmsGatewayHubProvider
  implements SmsProvider
{
  readonly providerName =
    'sms-gateway-hub';

  private readonly logger =
    new Logger(
      SmsGatewayHubProvider.name,
    );

  async sendSms(
    payload: SendSmsPayload,
  ): Promise<SmsProviderResponse> {
    try {
      const response =
        await axios.get(
          'https://www.smsgatewayhub.com/api/mt/SendSMS',

          {
            params: {
              APIKey:
                process.env
                  .SMS_GATEWAY_HUB_API_KEY,

              senderid:
                process.env
                  .SMS_GATEWAY_HUB_SENDER_ID,

              channel: '2',

              DCS: 0,

              flashsms: 0,

              number:
                payload.phone,

              text:
                payload.message,

              route: '1',

              EntityId:
                payload.entityId,

              dlttemplateid:
                payload.templateId,
            },

            timeout: 10000,
          },
        );

      

      const messageData =
        (response.data as any)
          ?.MessageData?.[0];

      this.logger.log(
        `SMS sent successfully to ${payload.phone}`,
      );

      return {
        success: true,

        provider:
          this.providerName,

        messageId:
          messageData?.MessageId,
      };
    } catch (error: any) {

      this.logger.error(
        `SMS sending failed`,
        error?.message,
      );

      return {
        success: false,

        provider:
          this.providerName,

        error:
          error?.response?.data ||
          error?.message ||
          'SMS sending failed',
      };
    }
  }
}