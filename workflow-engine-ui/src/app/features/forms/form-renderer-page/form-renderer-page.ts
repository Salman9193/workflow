import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormSchema } from '../../../models/form-schema.model';
import { FormSchemaService } from '../../../services/form-schema.service';
import { FormioModule } from '@formio/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-renderer-page',
  imports: [CommonModule, FormioModule, FormsModule],
  templateUrl: './form-renderer-page.html',
  styleUrl: './form-renderer-page.scss',
})
export class FormRendererPage {
  // Which saved form template to render.
  @Input({ required: true }) formSchemaName!: string;

  // The data to prefill — owned entirely by the parent now. Empty object
  // for a fresh step, or a prior submission's formData when resuming/reopening.
  @Input() initialData: any = {};

  // 'edit' = filler working the step; 'review' = reviewer seeing it read-only.
  @Input() mode: 'edit' | 'review' = 'edit';

  // Shown only in edit mode, when this step was reopened via change_requested.
  @Input() changeComment: string | null = null;

  // Emits raw form data on submit — the PARENT decides how/where to persist it.
  @Output() submitted = new EventEmitter<any>();

  schema: FormSchema | null = null;
  submissionWrapper: any = { data: {} };
  loading = true;

  constructor(private formSchemaService: FormSchemaService) {}

  ngOnInit(): void {
    this.loadSchema();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // If the parent swaps initialData after the schema's already loaded
    // (e.g. navigating between steps without a full component reload),
    // keep the renderer's submission in sync.
    if (changes['initialData'] && !changes['initialData'].firstChange && this.schema) {
      this.submissionWrapper = { data: this.initialData ?? {} };
    }
  }

  private loadSchema(): void {
    this.loading = true;
    this.formSchemaService.getByName(this.formSchemaName).subscribe(schema => {
      this.schema = schema ?? null;
      this.submissionWrapper = { data: this.initialData ?? {} };
      this.loading = false;
    });
  }

  onSubmit(event: any): void {
    if (this.mode !== 'edit') return;
    this.submitted.emit(event.data);
  }
}
