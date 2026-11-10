import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Step, StepType, StepStatus } from '../../models/step.model';

@Component({
  selector: 'app-step-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-card.html',
  styleUrl: './step-card.scss'
})
export class StepCardComponent {
  @Input({ required: true }) name!: string;
  @Input({ required: true }) type!: StepType;
  @Input({ required: true }) status!: StepStatus;

  @Output() cardClicked = new EventEmitter<void>();

  onClick(): void {
    this.cardClicked.emit();
  }
}
