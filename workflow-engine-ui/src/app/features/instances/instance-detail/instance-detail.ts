import { Component, OnInit } from '@angular/core';
import { WorkflowInstance } from '../../../models/workflow-instance.model';
import { WorkflowStepDef } from '../../../models/workflow.model';
import { ApprovalDecision, ReviewStepRef } from '../../../models/approval.model';
import { ActivatedRoute } from '@angular/router';
import { WorkflowInstanceService } from '../../../services/workflow-instance.service';
import { ApprovalStep } from '../../approvals/approval-step/approval-step';
import { FormRendererPage } from '../../forms/form-renderer-page/form-renderer-page';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-instance-detail',
  imports: [CommonModule, FormRendererPage, ApprovalStep],
  templateUrl: './instance-detail.html',
  styleUrl: './instance-detail.scss',
})
export class InstanceDetail implements OnInit {

  instance: WorkflowInstance | null = null;
  currentStep: WorkflowStepDef | null = null;
  reviewSteps: ReviewStepRef[] = [];
  changeComment: string | null = null;
  loading = true;
  prefillData: any = {};

  constructor(
    private route: ActivatedRoute,
    private workflowInstanceService: WorkflowInstanceService
  ) {}

  ngOnInit(): void {
    const instanceId = this.route.snapshot.paramMap.get('id')!;
    this.load(instanceId);
  }

  private load(instanceId: string): void {
  this.loading = true;
  this.workflowInstanceService.getInstance(instanceId).subscribe(instance => {
    if (!instance) { this.loading = false; return; }
    this.instance = instance;
    this.currentStep = this.workflowInstanceService.getWorkflowStep(instance, instance.currentStepId) ?? null;

    if (this.currentStep?.type === 'approval') {
      this.buildReviewSteps(instance, this.currentStep);
    } else if (this.currentStep?.type === 'form') {
      this.loadFormStepContext(instance, this.currentStep.id);
    } else {
      this.loading = false;
    }
  });
}

private loadFormStepContext(instance: WorkflowInstance, stepId: string): void {
  this.workflowInstanceService.getSubmission(instance.id, stepId).subscribe(sub => {
    this.prefillData = sub?.formData ?? {};
    this.changeComment = sub?.status === 'change_requested' ? sub.changeComment : null;
    this.loading = false;
  });
}

  private loadChangeComment(instance: WorkflowInstance, stepId: string): void {
    this.workflowInstanceService.getSubmission(instance.id, stepId).subscribe(sub => {
      this.changeComment = sub?.status === 'change_requested' ? sub.changeComment : null;
      this.loading = false;
    });
  }

  private buildReviewSteps(instance: WorkflowInstance, approvalStep: WorkflowStepDef): void {
    const workflow = this.workflowInstanceService.getWorkflow(instance)!;
    this.reviewSteps = (approvalStep.reviewStepIds ?? []).map(stepId => {
      const stepDef = workflow.steps.find((s: WorkflowStepDef) => s.id === stepId)!;
      return {
        stepId,
        formSchemaName: stepDef.formSchemaName!,
        stepName: stepDef.name,
        updatedSinceLastReview: true // simplified for now — real version-compare logic later
      };
    });
    this.loading = false;
  }

  onFormSubmitted(formData: any): void {
    if (!this.instance || !this.currentStep) return;
    this.workflowInstanceService.submitFormStep(this.instance, this.currentStep.id, formData, 'current-user')
      .subscribe(() => this.load(this.instance!.id));
  }

  onApprovalDecision(decision: ApprovalDecision): void {
    if (!this.instance || !this.currentStep) return;
    this.workflowInstanceService.submitApprovalDecision(this.instance, this.currentStep.id, decision, 'current-user')
      .subscribe(() => this.load(this.instance!.id));
  }
}
