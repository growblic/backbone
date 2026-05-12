export abstract class TaskSubmissionRepository {
  abstract create(data: {
    userId: string;

    taskId: string;

    submissionData: any;
  }): Promise<any>;

  abstract findById(
    submissionId: string,
  ): Promise<any>;

  abstract findUserSubmission(
    userId: string,

    taskId: string,
  ): Promise<any>;

  abstract getPendingSubmissions(): Promise<
    any[]
  >;

  abstract attachRewardTransaction(
  submissionId: string,

  transactionId: string,
): Promise<any>;

  abstract approve(
    submissionId: string,

    reviewedBy: string,
  ): Promise<any>;

  abstract reject(
    submissionId: string,

    reviewedBy: string,

    adminRemark?: string,
  ): Promise<any>;
}