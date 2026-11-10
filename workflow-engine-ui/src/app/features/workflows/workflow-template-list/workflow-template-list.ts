import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Workflow } from '../../../models/workflow.model';
import { WorkflowService } from '../../../services/workflow.service';

@Component({
  selector: 'app-workflow-template-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './workflow-template-list.html',
  styleUrl: './workflow-template-list.scss',
})
export class WorkflowTemplateList {
  workflows: Workflow[] = [];
    constructor(private workflowService: WorkflowService) {}
    ngOnInit(): void {
      this.workflowService.list().subscribe((list: Workflow[]) => this.workflows = list);
    }
}
