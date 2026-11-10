import { Injectable } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { WorkflowInstance } from '../models/workflow-instance.model';
import { StepSubmission } from '../models/step-submission.model';
import { Workflow, WorkflowStepDef } from '../models/workflow.model';
import { ApprovalDecision } from '../models/approval.model';
import { WorkflowService } from './workflow.service';

@Injectable({ providedIn: 'root' })
export class WorkflowInstanceService {
  private instances: WorkflowInstance[] = [];
  private submissions: StepSubmission[] = [];

  // Local synchronous cache of templates, kept in sync with WorkflowService.
  // This is a mock-data-only convenience — once a real backend exists, the
  // engine would query the template directly per-request instead of caching.
  private workflowsCache: Workflow[] = [];

  constructor(private workflowService: WorkflowService) {
    this.workflowService.list().subscribe(list => this.workflowsCache = list);
  }

  // ---- Reads ----

  listWorkflows(): Observable<Workflow[]> {
    return this.workflowService.list();
  }

  getInstance(id: string): Observable<WorkflowInstance | undefined> {
    return of(this.instances.find(i => i.id === id)).pipe(delay(150));
  }

  listInstances(): Observable<WorkflowInstance[]> {
    return of(this.instances).pipe(delay(150));
  }

  getSubmission(instanceId: string, stepId: string): Observable<StepSubmission | undefined> {
    const match = [...this.submissions]
      .reverse()
      .find(s => s.workflowInstanceId === instanceId && s.stepId === stepId);
    return of(match).pipe(delay(100));
  }

  getPrefillData(instanceId: string, stepId: string): Observable<any> {
    return this.getSubmission(instanceId, stepId).pipe(
      map(sub => sub?.formData ?? {})
    );
  }

  // Synchronous — reads from the local cache, not the async WorkflowService.
  getWorkflow(instance: WorkflowInstance): Workflow | undefined {
    return this.workflowsCache.find(w => w.id === instance.workflowId);
  }

  getWorkflowStep(instance: WorkflowInstance, stepId: string): WorkflowStepDef | undefined {
    return this.getWorkflow(instance)?.steps.find(s => s.id === stepId);
  }

  // ---- Writes ----

  createInstance(workflowId: string, name: string, startedBy: string): Observable<WorkflowInstance> {
    const workflow = this.workflowsCache.find(w => w.id === workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found — has it loaded into the cache yet?`);
    }
    const firstStep = [...workflow.steps].sort((a, b) => a.order - b.order)[0];
    const instance: WorkflowInstance = {
      id: crypto.randomUUID(),
      name,
      workflowId,
      workflowVersion: workflow.version,
      currentStepId: firstStep.id,
      status: 'active',
      startedBy,
      startedAt: new Date().toISOString()
    };
    this.instances = [...this.instances, instance];
    return of(instance).pipe(delay(200));
  }

  submitFormStep(instance: WorkflowInstance, stepId: string, formData: any, submittedBy: string): Observable<WorkflowInstance> {
    const prev = this.submissions
      .filter(s => s.workflowInstanceId === instance.id && s.stepId === stepId)
      .sort((a, b) => b.version - a.version)[0];

    const submission: StepSubmission = {
      id: crypto.randomUUID(),
      workflowInstanceId: instance.id,
      stepId,
      version: (prev?.version ?? 0) + 1,
      formData,
      status: 'submitted',
      changeComment: null,
      flaggedByStepId: null,
      submittedBy,
      submittedAt: new Date().toISOString(),
      previousVersionId: prev?.id ?? null
    };
    this.submissions = [...this.submissions, submission];

    const updated = this.advanceToNextStep(instance);
    return of(updated).pipe(delay(250));
  }

  submitApprovalDecision(instance: WorkflowInstance, approvalStepId: string, decision: ApprovalDecision, submittedBy: string): Observable<WorkflowInstance> {
    let updated = instance;

    switch (decision.outcome) {
      case 'approved': {
        this.recordApprovalSubmission(instance, approvalStepId, 'approved', null, null, submittedBy);
        updated = this.advanceToNextStep(instance);
        break;
      }
      case 'rejected': {
        this.recordApprovalSubmission(instance, approvalStepId, 'submitted', decision.overallComment, null, submittedBy);
        updated = { ...instance, status: 'rejected' };
        this.instances = this.instances.map(i => i.id === instance.id ? updated : i);
        break;
      }
      case 'change_requested': {
        this.recordApprovalSubmission(instance, approvalStepId, 'submitted', null, null, submittedBy);

        for (const flaggedStepId of decision.flaggedStepIds) {
          this.markChangeRequested(instance, flaggedStepId, decision.stepComments[flaggedStepId], approvalStepId, submittedBy);
          this.cascadeInvalidate(instance, flaggedStepId);
        }

        const earliest = this.findEarliestStep(instance, decision.flaggedStepIds);
        updated = { ...instance, currentStepId: earliest };
        this.instances = this.instances.map(i => i.id === instance.id ? updated : i);
        break;
      }
    }

    return of(updated).pipe(delay(250));
  }

  // ---- Engine internals ----

  private recordApprovalSubmission(instance: WorkflowInstance, stepId: string, status: StepSubmission['status'], changeComment: string | null, flaggedByStepId: string | null, submittedBy: string): void {
    const prev = this.submissions
      .filter(s => s.workflowInstanceId === instance.id && s.stepId === stepId)
      .sort((a, b) => b.version - a.version)[0];

    const submission: StepSubmission = {
      id: crypto.randomUUID(),
      workflowInstanceId: instance.id,
      stepId,
      version: (prev?.version ?? 0) + 1,
      formData: {},
      status,
      changeComment,
      flaggedByStepId,
      submittedBy,
      submittedAt: new Date().toISOString(),
      previousVersionId: prev?.id ?? null
    };
    this.submissions = [...this.submissions, submission];
  }

  private markChangeRequested(instance: WorkflowInstance, stepId: string, comment: string, flaggedByStepId: string, submittedBy: string): void {
    const prev = this.submissions
      .filter(s => s.workflowInstanceId === instance.id && s.stepId === stepId)
      .sort((a, b) => b.version - a.version)[0];

    const submission: StepSubmission = {
      ...(prev as StepSubmission),
      id: crypto.randomUUID(),
      version: (prev?.version ?? 0) + 1,
      status: 'change_requested',
      changeComment: comment || null,
      flaggedByStepId,
      submittedBy,
      submittedAt: new Date().toISOString(),
      previousVersionId: prev?.id ?? null
    };
    this.submissions = [...this.submissions, submission];
  }

  private cascadeInvalidate(instance: WorkflowInstance, changedStepId: string): void {
    const workflow = this.getWorkflow(instance);
    if (!workflow) return;

    for (const step of workflow.steps.filter(s => s.type === 'approval')) {
      if (step.reviewStepIds?.includes(changedStepId)) {
        const latest = this.submissions
          .filter(s => s.workflowInstanceId === instance.id && s.stepId === step.id)
          .sort((a, b) => b.version - a.version)[0];
        if (latest?.status === 'approved') {
          this.markChangeRequested(instance, step.id, '', changedStepId, 'system');
        }
      }
    }
  }

  private findEarliestStep(instance: WorkflowInstance, stepIds: string[]): string {
    const workflow = this.getWorkflow(instance)!;
    const ordered = workflow.steps
      .filter(s => stepIds.includes(s.id))
      .sort((a, b) => a.order - b.order);
    return ordered[0].id;
  }

  private advanceToNextStep(instance: WorkflowInstance): WorkflowInstance {
    const workflow = this.getWorkflow(instance)!;
    const sorted = [...workflow.steps].sort((a, b) => a.order - b.order);
    const currentIndex = sorted.findIndex(s => s.id === instance.currentStepId);
    const next = sorted[currentIndex + 1];

    const updated: WorkflowInstance = next
      ? { ...instance, currentStepId: next.id }
      : { ...instance, status: 'completed' };

    this.instances = this.instances.map(i => i.id === instance.id ? updated : i);
    return updated;
  }
}