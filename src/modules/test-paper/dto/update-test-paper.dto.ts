import { PartialType } from '@nestjs/mapped-types';
import { CreateTestPaperDto } from './create-test-paper.dto';

export class UpdateTestPaperDto extends PartialType(CreateTestPaperDto) {}
