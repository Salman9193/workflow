import { Workflow } from './workflow.model';

export const MOCK_WORKFLOW: Workflow = {
  id: 'wf-onboarding',
  name: 'Client Onboarding',
  version: 1,
  steps: [
    { id: 'step-1', order: 1, type: 'form', name: 'Client Risk Assessment', formSchemaName: 'Client Risk Assessment' },
    { id: 'step-2', order: 2, type: 'form', name: 'Engagement Scope', formSchemaName: 'Engagement Scope' },
    {
      id: 'step-3', order: 3, type: 'approval', name: 'Compliance Review',
      reviewStepIds: ['step-1', 'step-2'], reviewerRole: 'compliance-lead'
    },
    { id: 'step-4', order: 4, type: 'form', name: 'Final Signoff', formSchemaName: 'Final Signoff' },
  ]
};