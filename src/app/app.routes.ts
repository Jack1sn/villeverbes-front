import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';

import { FuncionarioComponent } from './pages/funcionario/funcionario.component';
import { HomeFuncionarioComponent } from './pages/home-funcionario/home-funcionario.component';
import {Fase2Component} from './pages/fase2/fase2.component';
import {Fase3Component} from './pages/fase3/fase3.component';
import { Fase1Component } from './pages/fase1/fase1.component';
import { AmbienteuniversidadeComponent } from './pages/ambienteuniversidade/ambienteuniversidade.component';
import { AmbienteparqueComponent } from './pages/ambienteparque/ambienteparque.component';

import { VisualizarRankingComponent } from './pages/visualizar-ranking/visualizar-ranking.component';
import { AmbientecasaComponent } from './pages/ambientecasa/ambientecasa.component';
import { authGuard } from './auth.guard';
import { AutoCadastroComponent } from './pages/auto-cadastro/auto-cadastro.component';

import { EfetuarManutencaoComponent } from './pages/efetuar-manutencao/efetuar-manutencao.component';
import { HomeComponent } from './pages/home/home.component';
import { CrudsentencasComponent } from './pages/crudsentencas/crudsentencas.component';
import { RankingComponent } from './pages/ranking/ranking.component';
import { RespostasCertasComponent } from './pages/respostas-certas/respostas-certas.component';
import { ManutencaoComponent } from './pages/manutencao/manutencao.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'autocadastro',
    component: AutoCadastroComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['JOGADOR'] },
  },
  {
    path: 'home-funcionarios',
    component: HomeFuncionarioComponent,
    canActivate: [authGuard],
    data: { expectedRoles: [ 'ADMIN'] },
  },
  {
    path: 'manutencao',
    component: ManutencaoComponent,
    canActivate: [authGuard],
    data: { expectedRoles: [ 'ADMIN']  },
  },
  {
    path: 'funcionario',
    component: FuncionarioComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['ADMIN'] },
  },
  {
    path: 'respostascertas/:id',
    component: RespostasCertasComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['Jogador'] },
  },
  {
    path: 'ranking/:id',
    component: RankingComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['JOGADOR'] },
  },
  {
    path: 'fase1/:id',
    component: Fase1Component,
    canActivate: [authGuard],
    data: { expectedRoles: ['JOGADOR'] },
  },
  {
    path: 'ambientecasa',
    component: AmbientecasaComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['JOGADOR'] },
  },
  {
    path: 'ambienteparque',
    component: AmbienteparqueComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['JOGADOR'] },
  },
  {
    path: 'ambientecasa',
    component: AmbienteuniversidadeComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['JOGADOR'] },
  },
  {
    path: 'efetuar-manutencao',
    component: EfetuarManutencaoComponent,
    canActivate: [authGuard],
    data: { expectedRoles: [ 'ADMIN'] },
  },
  {
    path: 'crud-fases/:id',
    component: CrudsentencasComponent,
    canActivate: [authGuard],
    data: { expectedRoles: [ 'ADMIN'] },
  },
  {
    path: 'crud-frases/:id',
    component: CrudsentencasComponent,
    canActivate: [authGuard],
    data: { expectedRoles: [ 'ADMIN'] },
  },
  
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
