import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { FuncionarioComponent } from './pages/funcionario/funcionario.component';
import { HomeFuncionarioComponent } from './pages/home-funcionario/home-funcionario.component';
import { HomeComponent } from './pages/home/home.component';
import { VisualizarRankingComponent } from './pages/visualizar-ranking/visualizar-ranking.component';
import { RankingComponent } from './pages/ranking/ranking.component';
import { authGuard } from './auth.guard';
import { AutoCadastroComponent } from './pages/auto-cadastro/auto-cadastro.component';
import { ManutencaoComponent } from './pages/manutencao/manutencao.component';
import { AmbientecasaComponent } from './pages/ambientecasa/ambientecasa.component';
import { AmbienteparqueComponent } from './pages/ambienteparque/ambienteparque.component';
import { AmbienteuniversidadeComponent } from './pages/ambienteuniversidade/ambienteuniversidade.component';
import { Fase1Component } from './pages/fase1/fase1.component';
import { CrudsentencasComponent } from './pages/crudsentencas/crudsentencas.component';
import { CrudfasesComponent } from './pages/crudfases/crudfases.component';
import { Fase2Component } from './pages/fase2/fase2.component';
import { Fase3Component } from './pages/fase3/fase3.component';
import { HeaderComponent } from './pages/header/header.component';
import { CrudAmbienteComponent } from './pages/crud-ambiente/crud-ambiente.component';
import { HomeAdminComponent } from './pages/home-admin/home-admin.component';
import { CrudAdminsComponent } from './pages/crud-admins/crud-admins.component';
import { TropheeComponent } from './pages/trophee/trophee.component';
import { ConfigJogadorComponent } from './pages/config-jogador/config-jogador.component';
import { TelaInicialComponent } from './pages/tela-inicial/tela-inicial.component'; 
export const routes: Routes = [

  { path: 'tela-inicial', component: TelaInicialComponent },
  { path: 'login', component: LoginComponent },
  { path: 'autocadastro', component: AutoCadastroComponent },

  { path: 'header', component: HeaderComponent },


  { path: 'crudAmbiente', component: CrudAmbienteComponent, 
    canActivate:[authGuard],
    data:{expectedRoles:['ADMIN','SUPERADMIN']}
   },

  // Rotas acessíveis apenas para JOGADOR
  {
    path: 'home',
    component: HomeComponent,
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
    path: 'ambienteuniversidade',
    component: AmbienteuniversidadeComponent,
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
    path: 'ranking/:id',
    component: RankingComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['JOGADOR'] },
  },
  {
    path: 'trophee/:id',
    component: TropheeComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['JOGADOR'] },
  },


  {
    path: 'congig-jogador',
    component: ConfigJogadorComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['JOGADOR'] },
  },





  // Admins
  {
    path: 'home-admin',
    component: HomeAdminComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['SUPERADMIN', 'ADMIN'] },
  },
  {
    path: 'crud-admins',
    component: CrudAdminsComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['SUPERADMIN'] },
  },
  {
    path: 'crudAbiente',
    component: CrudAmbienteComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['SUPERADMIN', 'ADMIN'] },
  },

  {
    path: 'trophee',
    component: TropheeComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['SUPERADMIN', 'ADMIN'] },
  },
  // Fases para jogadores
  {
    path: 'fase1',
    component: Fase1Component,
    canActivate: [authGuard],
    data: { expectedRoles: ['JOGADOR'] },
  },
  {
    path: 'fase2',
    component: Fase2Component,
    canActivate: [authGuard],
    data: { expectedRoles: ['JOGADOR'] },
  },
  {
    path: 'fase3',
    component: Fase3Component,
    canActivate: [authGuard],
    data: { expectedRoles: ['JOGADOR'] },
  },

  // CRUDs para admins
  {
    path: 'crudsentencas',
    component: CrudsentencasComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['SUPERADMIN', 'ADMIN'] },
  },
  {
    path: 'crudfases',
    component: CrudfasesComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['SUPERADMIN', 'ADMIN'] },
  },

  // Ranking visualização por admin
  {
    path: 'visualizar-ranking/:id',
    component: VisualizarRankingComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['ADMIN'] },
  },

  // Redirecionamento padrão
  { path: '**', redirectTo: 'tela-inicial',pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
