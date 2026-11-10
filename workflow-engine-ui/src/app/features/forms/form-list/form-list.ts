import { Component, OnInit } from '@angular/core';
import { FormSchemaService } from '../../../services/form-schema.service';
import { FormSchema } from '../../../models/form-schema.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-form-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './form-list.html',
  styleUrl: './form-list.scss',
})
export class FormList implements OnInit{
  schemas: FormSchema[] = [];

  constructor(private formSchemaService: FormSchemaService) {}

  ngOnInit(): void {
    this.formSchemaService.list().subscribe(list => this.schemas = list);
  }
}
