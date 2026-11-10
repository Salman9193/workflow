export type StepType = 'form' | 'notification' | 'approval';
export type StepStatus = 'draft' | 'submitted' | 'approved' | 'change_requested';

export interface Step {
  id: string;
  name: string;
  type: StepType;
  status: StepStatus;
}