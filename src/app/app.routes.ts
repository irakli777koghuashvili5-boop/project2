import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./home/home').then(m => m.Home)
    },
        {
        path: 'menu',
        loadComponent: () => import('./menu/menu').then(m => m.Menu)
    },
    {
        path: `details`,
        loadComponent: () => import('./details/details').then(m => m.Details)
    },
    {
        path:"**",
        loadComponent: () => import('./error/error').then(m => m.Error)
    }

];
