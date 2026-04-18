import { Routes } from '@angular/router';
import { guardGuard } from './guard/guard-guard';

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
        path: `sign-up`,
        loadComponent: () => import('./sign-up/sign-up').then(m => m.SignUp)
    },
    {
        path: `log-in`,
        loadComponent: () => import('./log-in/log-in').then(m => m.LogIn)
    },
    {
        path: `recover-passcode`,
        loadComponent: () => import('./recover-passcode/recover-passcode').then(m => m.RecoverPasscode)
    },
    {
        path: `cart`,
        loadComponent: () => import('./cart/cart').then(m => m.Cart),
        canActivate: [guardGuard]  
    },
    {
        path: `profile`,
        loadComponent: () => import('./profile/profile').then(m => m.Profile),
        canActivate: [guardGuard]
    },
    {
        path:"**",
        loadComponent: () => import('./error/error').then(m => m.Error)
    }

];
