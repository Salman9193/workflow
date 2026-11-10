export interface FormSchema {
  id: string;
  name: string;
  version: number;
  definition: any; // Form.io's JSON schema shape — typed loosely, Form.io owns this structure
  createdAt: string;
}