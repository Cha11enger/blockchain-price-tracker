import { ApiProperty } from '@nestjs/swagger';

export class SwapRateResponseDto {
  @ApiProperty({ description: 'Equivalent amount of BTC for the given chain', example: 0.03876251064548407 })
  equivalentBTC: number;

  @ApiProperty({
    description: 'Details of the fee applied (inChain is the fee in ETH/MATIC and inDollar is the fee in USD)',
    example: { inChain: 0.03, inDollar: 77.56 },
  })
  fee: {
    inChain: number;
    inDollar: number;
  };
}
