import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { EmployeesComponent } from './employees.component';
import { EmployeeService } from '../service/employee.service';
import { Employee } from '../model/employee';

describe('EmployeesComponent', () => {
  let component: EmployeesComponent;
  let fixture: ComponentFixture<EmployeesComponent>;

  beforeEach(() => {
    // Dates créées comme dans le formulaire : 'aaaa-mm-jj' donne minuit UTC (affiché en UTC dans le tableau).
    const stored = [
      new Employee('Ada Lovelace', new Date('1990-12-10'), 'Ottawa', 85000, 'F', 'ada@example.com'),
      new Employee('Alan Turing', new Date('1985-06-23'), 'Gatineau', 90000, 'M', 'alan@example.com')
    ];
    TestBed.configureTestingModule({
      imports: [EmployeesComponent],
      providers: [provideRouter([]), { provide: EmployeeService, useValue: { $: of(stored) } }]
    });
    fixture = TestBed.createComponent(EmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays every stored employee in the table', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('Ada Lovelace');
    expect(rows[0].textContent).toContain('10/Dec/1990');
    expect(rows[1].textContent).toContain('Gatineau');
  });
});

describe('EmployeesComponent (empty collection)', () => {
  it('reads the Firestore stream once and shows a message when there is no employee', () => {
    let reads = 0;
    const service = { get $() { reads++; return of([]); } };
    TestBed.configureTestingModule({
      imports: [EmployeesComponent],
      providers: [provideRouter([]), { provide: EmployeeService, useValue: service }]
    });
    const fixture = TestBed.createComponent(EmployeesComponent);
    fixture.detectChanges();
    fixture.detectChanges();

    expect(reads).toBe(1);
    expect(fixture.nativeElement.querySelector('table')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('No employees saved yet');
  });
});
