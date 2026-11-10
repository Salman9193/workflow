import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { FormSchema } from '../models/form-schema.model';

@Injectable({ providedIn: 'root' })
export class FormSchemaService {
  // In-memory mock store — will become real HTTP calls to FastAPI later.
  // Kept as a class field (not a plain array export) so it behaves like a
  // singleton service would against a real backend: one shared store per app instance.
  private schemas: FormSchema[] = [
    {
      id: 'ae2127b8-c990-4e6d-9aaf-e88104b5a463',
      name: "Client Risk Assessment",
      version: 1,
      definition: {
            "display": "form",
            "components": [
                {
                    "label": "Client Name",
                    "labelPosition": "left-left",
                    "applyMaskOn": "change",
                    "tableView": true,
                    "validateWhenHidden": false,
                    "key": "clientName",
                    "type": "textfield",
                    "input": true
                },
                {
                    "type": "button",
                    "label": "Submit",
                    "key": "submit",
                    "disableOnInvalid": true,
                    "input": true,
                    "tableView": false
                }
            ]
        },
      createdAt: "2026-09-15T11:14:17.655Z"
    },
    {
      id: 'ae2127b8-c990-4e6d-9aaf-e88104b5a463',
      name: "Engagement Scope",
      version: 1,
      definition: {
            "display": "form",
            "components": [
                {
                    "label": "Client Engagment Name",
                    "labelPosition": "left-left",
                    "applyMaskOn": "change",
                    "tableView": true,
                    "validateWhenHidden": false,
                    "key": "clientName",
                    "type": "textfield",
                    "input": true
                },
                {
                    "type": "button",
                    "label": "Submit",
                    "key": "submit",
                    "disableOnInvalid": true,
                    "input": true,
                    "tableView": false
                }
            ]
        },
      createdAt: "2026-09-15T11:14:17.655Z"
    }
];

  save(name: string, definition: any): Observable<FormSchema> {
    console.log(this.schemas)
    const existing = this.schemas.find(s => s.name === name);
    const schema: FormSchema = {
      id: existing?.id ?? crypto.randomUUID(),
      name,
      version: (existing?.version ?? 0) + 1,
      definition,
      createdAt: new Date().toISOString()
    };
    this.schemas = [...this.schemas.filter(s => s.name !== name), schema];
    console.log(this.schemas);
    // delay() simulates real network latency — keeps async-handling code honest
    // even against mock data, so you're not surprised when the real API arrives.
    return of(schema).pipe();
  }

  list(): Observable<FormSchema[]> {
    return of(this.schemas).pipe();
  }

  getByName(name: string): Observable<FormSchema | undefined> {
    return of(this.schemas.find(s => s.name === name)).pipe();
  }

  getById(id: string): Observable<FormSchema | undefined> {
    return of(this.schemas.find(s => s.id === id)).pipe(delay(150));
  }

}