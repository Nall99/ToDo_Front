import { Component } from '@angular/core';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse'; // Ensure this path is correct and MdbCollapseModule is an NgModule

@Component({
    selector: 'app-menu',
    imports: [MdbCollapseModule],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss'
})
export class MenuComponent {

}
