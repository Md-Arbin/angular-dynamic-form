import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

export type FieldType = 'text' | 'textarea' | 'date' | 'dropdown' | 'multiselect' | 'checkbox';

export interface FieldSchema {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  validation?: { pattern?: string; message?: string };
  options?: string[];
  placeholder?: string;
}

export interface FormSchema {
  title?: string;
  fields: FieldSchema[];
}

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  @Input() schema!: FormSchema;
  @Output() submitted = new EventEmitter<any>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    const group: { [key: string]: FormControl } = {};

    this.schema.fields.forEach(f => {
      const validators: any[] = [];

      if (f.required) validators.push(Validators.required);
      if (f.validation && f.validation.pattern) {
        try {
          const re = new RegExp(f.validation.pattern);
          validators.push(Validators.pattern(re));
        } catch (e) {
          console.warn('Invalid regex in schema for field', f.name);
        }
      }

      let defaultValue: any = null;
      if (f.type === 'checkbox') defaultValue = false;
      if (f.type === 'multiselect') defaultValue = [];

      group[f.name] = new FormControl('', validators);
    });

    this.form = new FormGroup(group);
  }

  getErrorMessage(field: FieldSchema) {
    const control = this.form.get(field.name);
    if (!control || !control.errors) return null;
    if (control.errors['required']) return `${field.label} is required.`;
    if (control.errors['pattern']) return field.validation?.message || `${field.label} format is invalid.`;
    return 'Invalid';
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.value;
    this.submitted.emit(value);
  }

  ngOnChanges(changes: SimpleChanges): void {
  if (changes['schema'] && changes['schema'].currentValue) {
    this.buildForm();
  }
}

}
