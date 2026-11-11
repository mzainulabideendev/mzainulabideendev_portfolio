import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent),
    data: { animation: 'HomePage' }
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent),
    data: { animation: 'LoginPage' }
  },
  {
    path: 'admin/bio',
    loadComponent: () =>
      import('./features/admin/bio-admin/bio-admin.component').then(m => m.BioAdminComponent),
    canActivate: [authGuard],
    data: { animation: 'AdminBioPage' }
  },
  {
    path: 'admin/books',
    loadComponent: () =>
      import('./features/admin/books-admin/books-admin.component').then(m => m.BooksAdminComponent),
    canActivate: [authGuard],
    data: { animation: 'AdminBooksPage' }
  },
  {
    path: 'admin/contacts',
    loadComponent: () =>
      import('./features/admin/contacts-admin/contacts-admin.component').then(m => m.ContactsAdminComponent),
    canActivate: [authGuard],
    data: { animation: 'AdminContactsPage' }
  },
  {
    path: 'admin/projects',
    loadComponent: () =>
      import('./features/admin/projects-admin/projects-admin.component').then(m => m.ProjectsAdminComponent),
    canActivate: [authGuard],
    data: { animation: 'AdminProjectsPage' }
  },
  {
    path: 'admin/pictures',
    loadComponent: () =>
      import('./features/admin/pictures-admin/pictures-admin.component').then(m => m.PicturesAdminComponent),
    canActivate: [authGuard],
    data: { animation: 'AdminPicturesPage' }
  },
  {
    path: '**',
    redirectTo: ''
  }
];
