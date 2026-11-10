import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Workflow, WorkflowStepDef } from '../models/workflow.model';
import { MOCK_WORKFLOW } from '../models/workflow-mock-instances';

@Injectable({ providedIn: 'root' })
export class WorkflowService {
  private workflows: Workflow[] = [MOCK_WORKFLOW];

  list(): Observable<Workflow[]> {
    return of(this.workflows).pipe(delay(150));
  }

  getById(id: string): Observable<Workflow | undefined> {
    return of(this.workflows.find(w => w.id === id)).pipe(delay(150));
  }

  create(name: string, steps: WorkflowStepDef[]): Observable<Workflow> {
    const workflow: Workflow = {
      id: crypto.randomUUID(),
      name,
      version: 1,
      steps
    };
    this.workflows = [...this.workflows, workflow];
    return of(workflow).pipe(delay(200));
  }

  // Editing produces a new version — same "draft edits don't silently
  // mutate what's live" principle as the system design doc's §8.
  update(id: string, name: string, steps: WorkflowStepDef[]): Observable<Workflow> {
    const existing = this.workflows.find(w => w.id === id)!;
    const updated: Workflow = { ...existing, name, steps, version: existing.version + 1 };
    this.workflows = this.workflows.map(w => w.id === id ? updated : w);
    return of(updated).pipe(delay(200));
  }
}