import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Workflow } from '../../../models/workflow.model';
import { WorkflowService } from '../../../services/workflow.service';

@Component({
  selector: 'app-workflow-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './workflow-list.html',
  styleUrl: './workflow-list.scss',
})
export class WorkflowList implements OnInit {
  workflows: Workflow[] = [];
  constructor(private workflowService: WorkflowService) {}
  ngOnInit(): void {
    this.workflowService.list().subscribe((list: Workflow[]) => this.workflows = list);
  }
}
