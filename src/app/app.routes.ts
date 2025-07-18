import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { VisualizarRankingComponent } from './pages/visualizar-ranking/visualizar-ranking.component';
import { RankingComponent } from './pages/ranking/ranking.component';
import { authGuard } from './auth.guard';
import { AutoCadastroComponent } from './pages/auto-cadastro/auto-cadastro.component';
import { AmbientecasaComponent } from './pages/ambientecasa/ambientecasa.component';
import { AmbienteparqueComponent } from './pages/ambienteparque/ambienteparque.component';
import { AmbienteuniversidadeComponent } from './pages/ambienteuniversidade/ambienteuniversidade.component';
import { HeaderComponent } from './pages/header/header.component';

import { CrudfasesComponent } from './pages/crudfases/crudfases.component';


import { CrudAmbienteComponent } from './pages/crud-ambiente/crud-ambiente.component';
import { HomeAdminComponent } from './pages/home-admin/home-admin.component';
import { TropheeComponent } from './pages/trophee/trophee.component';
import { ConfigJogadorComponent } from './pages/config-jogador/config-jogador.component';
import { TelaInicialComponent } from './pages/tela-inicial/tela-inicial.component'; 
import { AjudaComponent } from './pages/ajuda/ajuda.component';
import { HomeComponent } from './pages/home/home.component';
import { CrudColaboradorComponent } from './pages/crud-colaborador/crud-colaborador.component';
import { VisualisarColaboradorComponent } from './pages/visualisar-colaborador/visualisar-colaborador.component';
import { RedefinirSenhaComponent } from './pages/redefinir-senha/redefinir-senha.component';
import { VisualizarJogadoresComponent } from './pages/visulizar-jogadores/visualizar-jogadores.component';
export const routes: Routes = [

  { path: 'tela-inicial', component: TelaInicialComponent },
  { path: 'login', component: LoginComponent },
  { path: 'autocadastro', component: AutoCadastroComponent },

  { path: 'header', component: HeaderComponent },


  { path: 'crudAmbiente', component: CrudAmbienteComponent, 
    canActivate:[authGuard],
    data:{expectedRoles:['ADMIN','COLABORATEUR']}
   },

  // Rotas acessíveis apenas para JOGADOR
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['JOUEUR'] },
  },
  {
    path: 'ambientecasa',
    component: AmbientecasaComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['JOUEUR'] },
  },
  {
    path: 'ambienteuniversidade',
    component: AmbienteuniversidadeComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['JOUEUR'] },
  },
  {
    path: 'ambienteparque',
    component: AmbienteparqueComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['JOUEUR'] },
  },
  {
  path: 'ranking/todos',
  component:RankingComponent,
  canActivate: [authGuard],
  data: { expectedRoles: ['ADMIN', 'COLABORATEUR'] }
}, {
  path: 'ranking/todos-simples',
  component:RankingComponent,
  canActivate: [authGuard],
  data: { expectedRoles: ['ADMIN', 'COLABORATEUR'] }
},


  {
    path: 'ranking/:id',
    component: RankingComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['JOUEUR'] },
  },
   {
  path: 'trophee/:id/todos',
  component: TropheeComponent,
  canActivate: [authGuard],
  data: { expectedRoles: ['JOUEUR'] },
},
  {
  path: 'trophee/todos',
  component: TropheeComponent,
  canActivate: [authGuard],
  data: { expectedRoles: ['ADMIN', 'COLABORATEUR'] },
},
  {
    path: 'trophee/:id',
    component: TropheeComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['JOUEUR'] },
  },
   
   {
    path: 'redefinir-senha',
    component: RedefinirSenhaComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['JOUEUR'] },
  },


  {
    path: 'congig-jogador',
    component: ConfigJogadorComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['JOUEUR', 'ADMIN', 'COLABORATEUR'] },
  },





  // Admins
  {
    path: 'home-admin',
    component: HomeAdminComponent,
    canActivate: [authGuard],
    data: { expectedRoles: [ 'ADMIN', 'COLABORATEUR'] },
  },
  {
    path: 'crud-colaborador',
    component: CrudColaboradorComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['ADMIN'] },
  },
  {
    path: 'visualizar-colaborador',
    component: VisualisarColaboradorComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['ADMIN'] },
  },
   {
    path: 'visualizar-jogadores',
    component:VisualizarJogadoresComponent ,
    canActivate: [authGuard],
    data: { expectedRoles: ['ADMIN'] },
  },

  {
    path: 'crudAbiente',
    component: CrudAmbienteComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['COLABORATEUR', 'ADMIN'] },
  },

  {
    path: 'trophee',
    component: TropheeComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['COLABORATEUR', 'ADMIN'] },
  },

  {
    path: 'ajuda',
    component: AjudaComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['COLABORATEUR', 'ADMIN'] },
  },
  {
  path: 'ranking-completo',
  component: RankingComponent,
  canActivate: [authGuard],
  data: { expectedRoles: ['ADMIN'] }
},

  
  // Fases para jogadores
  
    
   
 

  // CRUDs para admins
  
  {
    path: 'crudfases',
    component: CrudfasesComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['COLABORATEUR', 'ADMIN'] },
  },

  // Ranking visualização por admin
  {
    path: 'visualizar-ranking/:id',
    component: VisualizarRankingComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['ADMIN', 'COLABORATEUR'] },
  },

  // Redirecionamento padrão
  { path: '**', redirectTo: 'tela-inicial',pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
