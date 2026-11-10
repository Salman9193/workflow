import { StepSubmission } from './step-submission.model';

export interface WorkflowInstance {
  id: string;
  name: string;
  workflowId: string;
  workflowVersion: number;
  currentStepId: string;
  status: 'active' | 'completed' | 'rejected';
  startedBy: string;
  startedAt: string;
}

// Convenience shape for the runtime UI — an instance plus the latest
// submission per step, so the detail page doesn't have to join these itself.
export interface InstanceWithSubmissions {
  instance: WorkflowInstance;
  submissionsByStepId: Record<string, StepSubmission>;
}