export type ApprovalOutcome = 'approved' | 'rejected' | 'change_requested';

export interface ApprovalDecision {
  outcome: ApprovalOutcome;
  overallComment: string;
  flaggedStepIds: string[];   // only relevant when outcome === 'change_requested'
  stepComments: Record<string, string>;
}

export interface ReviewStepRef {
  stepId: string;
  formSchemaName: string;   // resolves which schema/submission to render read-only
  stepName: string;
  updatedSinceLastReview: boolean;  // drives the "Updated" vs "Unchanged" badge
}