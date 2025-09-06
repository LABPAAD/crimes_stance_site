import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EventsCollectionComponent } from './pages/events/events-collection.component';
import { SentimentAnalysisComponent } from './pages/sentiment/sentiment-analysis.component';
import { OperationDetailsComponent } from './pages/operation-details/operation-details.component';

export const routes: Routes = [
	{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'coletas', component: EventsCollectionComponent },
	{ path: 'sentimento', component: SentimentAnalysisComponent },
	{ path: 'operacao/:id', component: OperationDetailsComponent }
];