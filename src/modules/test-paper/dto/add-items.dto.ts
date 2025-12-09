import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class AddItemsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  itemIds: number[];
}
