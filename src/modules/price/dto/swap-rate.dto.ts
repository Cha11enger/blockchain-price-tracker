import { ApiProperty } from '@nestjs/swagger';

export class SwapRateDto {
  @ApiProperty({ description: 'Chain for the swap (ethereum or polygon)', example: 'ethereum' })
  chain: string;

  @ApiProperty({ description: 'Amount of ETH or MATIC to swap', example: 1 })
  amount: number;
}
