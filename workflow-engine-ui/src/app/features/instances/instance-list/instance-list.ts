import { Component, OnInit } from '@angular/core';
import { WorkflowInstance } from '../../../models/workflow-instance.model';
import { WorkflowInstanceService } from '../../../services/workflow-instance.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WorkflowService } from '../../../services/workflow.service';

@Component({
  selector: 'app-instance-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './instance-list.html',
  styleUrl: './instance-list.scss',
})
export class InstanceList implements OnInit {
  instances: WorkflowInstance[] = [];
  workflowId: string | null = null;
  workflowName = '';

  constructor(
    private workflowInstanceService: WorkflowInstanceService,
    private workflowService: WorkflowService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.workflowId = this.route.snapshot.paramMap.get('workflowId');
    this.workflowInstanceService.listInstances().subscribe(list => {
      this.instances = this.workflowId
        ? list.filter(i => i.workflowId === this.workflowId)
        : list;
    });
    if (this.workflowId) {
      this.workflowService.getById(this.workflowId).subscribe(wf => {
        this.workflowName = wf?.name ?? '';
      });
    }
  }
}
