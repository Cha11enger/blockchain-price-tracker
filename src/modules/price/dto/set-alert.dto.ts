import { ApiProperty } from '@nestjs/swagger';

export class SetAlertDto {
  @ApiProperty({ description: 'Chain to set the alert for (ethereum or polygon)', example: 'ethereum' })
  chain: string;

  @ApiProperty({ description: 'Target price for the alert', example: 0.368 })
  targetPrice: number;

  @ApiProperty({ description: 'Email to send the alert to', example: 'hyperhire_assignment@hyperhire.in' })
  email: string;
}
