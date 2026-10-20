import {Component, inject} from '@angular/core';
import {EmployeeService} from "../service/employee.service";
import { RouterLink } from '@angular/router';
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
    selector: 'app-employees',
    templateUrl: './employees.component.html',
    styleUrls: ['./employees.component.css'],
    standalone: true,
    imports: [RouterLink, AsyncPipe, DatePipe, CurrencyPipe]
})
export class EmployeesComponent {
  // Le flux Firestore est créé une seule fois, à la création du composant.
  // Le template ne doit pas appeler le getter EmployeeService.$ directement : chaque appel
  // crée un nouvel Observable, le pipe async se réabonne en boucle et la page se bloque.
  protected readonly employees$ = inject(EmployeeService).$;
}
