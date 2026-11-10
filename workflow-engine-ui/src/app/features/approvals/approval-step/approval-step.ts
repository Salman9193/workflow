import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApprovalDecision, ApprovalOutcome, ReviewStepRef } from '../../../models/approval.model';
import { FormRendererPage } from '../../forms/form-renderer-page/form-renderer-page';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-approval-step',
  imports: [CommonModule, FormsModule, FormRendererPage],
  templateUrl: './approval-step.html',
  styleUrl: './approval-step.scss',
})
export class ApprovalStep {
  @Input({ required: true }) reviewSteps!: ReviewStepRef[];
  @Output() decisionSubmitted = new EventEmitter<ApprovalDecision>();

  outcome: ApprovalOutcome = 'approved';
  stepComments: Record<string, string> = {};
  overallComment = '';
  flaggedStepIds: Set<string> = new Set();
  submitting = false;

  get showFlagPicker(): boolean {
    return this.outcome === 'change_requested';
  }

  toggleFlag(stepId: string): void {
  if (this.flaggedStepIds.has(stepId)) {
    this.flaggedStepIds.delete(stepId);
    delete this.stepComments[stepId];  // clear its comment if un-flagged
  } else {
    this.flaggedStepIds.add(stepId);
    this.stepComments[stepId] ??= '';
  }
}

  get canSubmit(): boolean {
  if (this.outcome === 'change_requested') {
    if (this.flaggedStepIds.size === 0) return false;
    // every flagged step needs its own non-empty comment
    return Array.from(this.flaggedStepIds).every(id => this.stepComments[id]?.trim());
  }
  if (this.outcome === 'rejected' && !this.overallComment.trim()) return false;
  return true;
}

  onSubmit(): void {
  if (!this.canSubmit) return;
  this.submitting = true;
  this.decisionSubmitted.emit({
    outcome: this.outcome,
    overallComment: this.overallComment,
    stepComments: { ...this.stepComments },
    flaggedStepIds: Array.from(this.flaggedStepIds)
  });
}
}
