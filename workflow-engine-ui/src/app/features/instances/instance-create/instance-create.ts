import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkflowInstanceService } from '../../../services/workflow-instance.service';

@Component({
  selector: 'app-instance-create',
  imports: [CommonModule, FormsModule],
  templateUrl: './instance-create.html',
  styleUrl: './instance-create.scss',
})
export class InstanceCreate {
  name = '';
  workflowId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workflowInstanceService: WorkflowInstanceService
  ) {
    this.workflowId = this.route.snapshot.paramMap.get('workflowId')!;
  }

  onCreate(): void {
    if (!this.name.trim()) return;
    this.workflowInstanceService.createInstance(this.workflowId, this.name, 'current-user')
      .subscribe(instance => this.router.navigate(['/instances', instance.id]));
  }
}
