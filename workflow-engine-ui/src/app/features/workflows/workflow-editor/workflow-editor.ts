import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WorkflowStepDef } from '../../../models/workflow.model';
import { FormSchema } from '../../../models/form-schema.model';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkflowService } from '../../../services/workflow.service';
import { FormSchemaService } from '../../../services/form-schema.service';

@Component({
  selector: 'app-workflow-editor',
  imports: [CommonModule, FormsModule],
  templateUrl: './workflow-editor.html',
  styleUrl: './workflow-editor.scss',
})
export class WorkflowEditor implements OnInit{

  editingId: string | null = null;
  workflowName = '';
  steps: WorkflowStepDef[] = [];
  availableForms: FormSchema[] = [];
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workflowService: WorkflowService,
    private formSchemaService: FormSchemaService
  ) {}

  ngOnInit(): void {
    this.formSchemaService.list().subscribe(list => this.availableForms = list);

    this.editingId = this.route.snapshot.paramMap.get('id');
    if (this.editingId) {
      this.workflowService.getById(this.editingId).subscribe(wf => {
        if (wf) {
          this.workflowName = wf.name;
          this.steps = wf.steps.map(s => ({ ...s })); // clone, don't mutate the stored template directly
        }
      });
    }
  }

  addStep(): void {
    this.steps.push({
      id: crypto.randomUUID(),
      order: this.steps.length + 1,
      type: 'form',
      name: '',
    });
  }

  removeStep(index: number): void {
    this.steps.splice(index, 1);
    this.renumber();
  }

  moveUp(index: number): void {
    if (index === 0) return;
    [this.steps[index - 1], this.steps[index]] = [this.steps[index], this.steps[index - 1]];
    this.renumber();
  }

  moveDown(index: number): void {
    if (index === this.steps.length - 1) return;
    [this.steps[index], this.steps[index + 1]] = [this.steps[index + 1], this.steps[index]];
    this.renumber();
  }

  private renumber(): void {
    this.steps.forEach((s, i) => s.order = i + 1);
  }

  // For approval steps: toggle which earlier steps this one reviews
  toggleReviewStep(step: WorkflowStepDef, stepId: string): void {
    step.reviewStepIds = step.reviewStepIds ?? [];
    const idx = step.reviewStepIds.indexOf(stepId);
    if (idx >= 0) step.reviewStepIds.splice(idx, 1);
    else step.reviewStepIds.push(stepId);
  }

  // Steps eligible to be reviewed by a given approval step — anything before it
  priorSteps(step: WorkflowStepDef): WorkflowStepDef[] {
    const idx = this.steps.findIndex(s => s.id === step.id);
    return this.steps.slice(0, idx).filter(s => s.type === 'form');
  }

  get canSave(): boolean {
    return this.workflowName.trim().length > 0
      && this.steps.length > 0
      && this.steps.every(s => s.name.trim().length > 0)
      && this.steps.filter(s => s.type === 'form').every(s => !!s.formSchemaName);
  }

  onSave(): void {
    if (!this.canSave) return;
    this.saving = true;
    const obs = this.editingId
      ? this.workflowService.update(this.editingId, this.workflowName, this.steps)
      : this.workflowService.create(this.workflowName, this.steps);

    obs.subscribe(wf => {
      this.saving = false;
      this.router.navigate(['/admin/workflows']);
    });
  }
}
