import { Routes } from '@angular/router';
import { FormBuilderPage } from './features/forms/form-builder-page/form-builder-page';
import { InstanceList } from './features/instances/instance-list/instance-list';
import { InstanceCreate } from './features/instances/instance-create/instance-create';
import { InstanceDetail } from './features/instances/instance-detail/instance-detail';
import { FormList } from './features/forms/form-list/form-list';
import { WorkflowList } from './features/workflows/workflow-list/workflow-list';
import { WorkflowEditor } from './features/workflows/workflow-editor/workflow-editor';
import { WorkflowTemplateList } from './features/workflows/workflow-template-list/workflow-template-list';
import { AuthGuard } from './auth.guard';
import { Home } from './features/home/home/home';

export const routes: Routes = [
  { path: '', component: Home},

  { path: 'admin/forms', component: FormList, canActivate: [AuthGuard], data: { requiredRole: 'workflow-admin' } },
  { path: 'admin/forms/new', component: FormBuilderPage, canActivate: [AuthGuard], data: { requiredRole: 'workflow-admin' } },
  { path: 'admin/forms/:id/edit', component: FormBuilderPage, canActivate: [AuthGuard], data: { requiredRole: 'workflow-admin' } },

  { path: 'admin/workflows', component: WorkflowList, canActivate: [AuthGuard], data: { requiredRole: 'workflow-admin' } },
  { path: 'admin/workflows/new', component: WorkflowEditor, canActivate: [AuthGuard], data: { requiredRole: 'workflow-admin' } },
  { path: 'admin/workflows/:id/edit', component: WorkflowEditor, canActivate: [AuthGuard], data: { requiredRole: 'workflow-admin' } },

  { path: 'workflow-templates', component: WorkflowTemplateList, canActivate: [AuthGuard] },
  { path: 'workflow-templates/:workflowId/instances', component: InstanceList, canActivate: [AuthGuard] },
  { path: 'instances', component: InstanceList, canActivate: [AuthGuard] },
  { path: 'instances/new/:workflowId', component: InstanceCreate, canActivate: [AuthGuard] },
  { path: 'instances/:id', component: InstanceDetail, canActivate: [AuthGuard] },
];