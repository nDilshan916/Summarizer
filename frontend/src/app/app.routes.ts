import { Routes ,RouterModule} from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgModule } from '@angular/core';
export const routes: Routes = [
    {path: 'sidebar', component: SidebarComponent},
    {path: ' ', redirectTo: 'sidebar', pathMatch: 'full'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }