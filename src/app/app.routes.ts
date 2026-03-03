import { Routes } from '@angular/router';
import { LoginComponent } from './components/layout/login/login.component';
import { PrincipalComponent } from './components/layout/principal/principal.component';
import { TarefasListaComponent } from './components/tarefas/tarefas-lista/tarefas-lista.component';
import { TarefasDetalheComponent } from './components/tarefas/tarefas-detalhe/tarefas-detalhe.component';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'principal', component: PrincipalComponent, children: [
        {path: 'tarefas', component: TarefasListaComponent},
        {path: 'tarefas/a-fazer', component: TarefasListaComponent},
        {path: 'tarefas/fazendo', component: TarefasListaComponent},
        {path: 'tarefas/concluido', component: TarefasListaComponent},
        {path: 'tarefas/new', component: TarefasDetalheComponent},
        {path: 'tarefas/edit/:id', component: TarefasDetalheComponent}
    ]},
];
