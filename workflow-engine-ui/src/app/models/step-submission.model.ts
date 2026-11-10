export interface StepSubmission {
  id: string;
  workflowInstanceId: string;
  stepId: string;
  version: number;
  formData: any;
  status: 'draft' | 'submitted' | 'approved' | 'change_requested';
  changeComment: string | null;
  flaggedByStepId: string | null;
  submittedBy: string;
  submittedAt: string;
  previousVersionId: string | null;
}