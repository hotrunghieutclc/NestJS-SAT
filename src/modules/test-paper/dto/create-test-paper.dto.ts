import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateTestPaperDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  quantities?: number;
}
