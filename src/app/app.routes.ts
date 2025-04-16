import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent} from './pages/login/login.component';
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
export const routes: Routes = [
  { path: 'login', 
    component: LoginComponent },
    { path: 'header',
      component: HeaderComponent,
    },
  {
    path: 'autocadastro',
    component: AutoCadastroComponent,
  },

  {
    path: 'ambienteparque',
    component: AmbienteparqueComponent,
  },

  {
    path: 'ambienteuniversidade',
    component: AmbienteuniversidadeComponent,
  },

    { path: 'ambientecasa', 
      component: AmbientecasaComponent },
  
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['Jogador'] },
  },
  {
    path: 'home-funcionarios',
    component: HomeFuncionarioComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['FUNCIONARIO', 'ADMIN'] },
  },
 
  {
    path: 'funcionario',
    component: FuncionarioComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['ADMIN'] },
  },
 
  {
    path: 'manutencao',
    component: ManutencaoComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['FUNCIONARIO', 'ADMIN'] },
  },
 
   
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
  {
    path: 'crudsentencas',
    component: CrudsentencasComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['FUNCIONARIO', 'ADMIN'] },
  },
  {
    path: 'crudfases',
    component: CrudfasesComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['FUNCIONARIO', 'ADMIN'] },
  },
  
    
  {
    path: 'ranking/:id',
    component: RankingComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['JOGADOR'] },
  },
  {
    path: 'visualizar-ranking/:id',
    component: VisualizarRankingComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['ADMIN'] },
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
