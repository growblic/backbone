import {
  IsObject,
  IsString,
} from 'class-validator';

export class CreateTaskSubmissionDto {
  @IsString()
  taskId!: string;

  @IsObject()
  submissionData: any;
}