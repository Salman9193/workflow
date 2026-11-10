export type StepType = 'form' | 'notification' | 'approval';

export interface WorkflowStepDef {
  id: string;
  order: number;
  type: StepType;
  name: string;
  formSchemaName?: string;        // type=form / approval's own decision form (unused for now)
  reviewStepIds?: string[];       // type=approval only
  reviewerRole?: string;          // type=approval only
}

export interface Workflow {
  id: string;
  name: string;
  version: number;
  steps: WorkflowStepDef[];
}