import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EventsCollectionComponent } from './pages/collections/events-collection.component';
import { OpinionCollectionComponent } from './pages/collections/positioning-collection.component';
import { EventsAnalysisComponent } from './pages/analysis/events-analysis.component';
import { OpinionAnalysisComponent } from './pages/analysis/positioning-analysis.component';
import { OperationDetailsComponent } from './pages/details/operation-details.component';

export const routes: Routes = [
	{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'coletas/eventos', component: EventsCollectionComponent },
	{ path: 'coletas/posicionamento', component: OpinionCollectionComponent },
	{ path: 'analises/eventos', component: EventsAnalysisComponent },
	{ path: 'analises/posicionamento', component: OpinionAnalysisComponent },
	{ path: 'operacao/:id', component: OperationDetailsComponent }
];