import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Step } from '../../models/step.model';
import { StepCardComponent } from '../step-card/step-card';

@Component({
  selector: 'app-step-list',
  imports: [StepCardComponent],
  templateUrl: './step-list.html',
  styleUrl: './step-list.scss',
})
export class StepList {

  @Input({ required: true }) steps!: Step[];
  @Output() stepSelected = new EventEmitter<Step>();

  onCardClicked(step: Step): void {
    this.stepSelected.emit(step);
  }
}
