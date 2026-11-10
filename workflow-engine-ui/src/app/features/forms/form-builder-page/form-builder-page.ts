import { Component, OnInit } from '@angular/core';
import { FormSchemaService } from '../../../services/form-schema.service';
import { CommonModule } from '@angular/common';
import { FormioModule } from '@formio/angular';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-form-builder-page',
  imports: [CommonModule, FormsModule, FormioModule],
  templateUrl: './form-builder-page.html',
  styleUrl: './form-builder-page.scss',
})
export class FormBuilderPage implements OnInit {
  formName = '';
  readonly builderSchema: any = { display: 'form', components: [] };
  private currentSchema: any = this.builderSchema;
  editingId: string | null = null;
  saving = false;
  savedMessage = '';
  loading = false;

  constructor(
    private formSchemaService: FormSchemaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.editingId = this.route.snapshot.paramMap.get('id');
    if (this.editingId) {
      this.loading = true;
      this.formSchemaService.getById(this.editingId).subscribe(schema => {
        if (schema) {
          this.formName = schema.name;
          this.currentSchema = schema.definition;
          // builderSchema is readonly/set-once by design (circular-JSON fix from earlier) —
          // for edit mode we need the INITIAL value to actually be the loaded schema,
          // so assign it once here before the template ever binds [form].
          (this as any).builderSchema = schema.definition;
        }
        this.loading = false;
      });
    }
  }

  onBuilderChange(event: any): void {
    this.currentSchema = event?.form ?? this.currentSchema;
  }

  onSave(): void {
    if (!this.formName.trim()) {
      this.savedMessage = 'Give the form a name before saving.';
      return;
    }
    this.saving = true;
    this.formSchemaService.save(this.formName, this.currentSchema).subscribe(schema => {
      this.saving = false;
      this.savedMessage = `Saved "${schema.name}" — v${schema.version}`;
    });
  }
}