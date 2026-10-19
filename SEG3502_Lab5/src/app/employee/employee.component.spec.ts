import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { EmployeeComponent } from './employee.component';
import { EmployeeService } from '../service/employee.service';

describe('EmployeeComponent', () => {
  let component: EmployeeComponent;
  let fixture: ComponentFixture<EmployeeComponent>;
  let service: jasmine.SpyObj<EmployeeService>;

  beforeEach(() => {
    service = jasmine.createSpyObj<EmployeeService>('EmployeeService', ['addEmployee']);
    service.addEmployee.and.returnValue(Promise.resolve({} as any));
    TestBed.configureTestingModule({
      imports: [EmployeeComponent],
      providers: [provideRouter([]), { provide: EmployeeService, useValue: service }]
    });
    fixture = TestBed.createComponent(EmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('saves the employee to Firestore, then opens the employee list', async () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.employeeForm.setValue({
      name: 'Ada Lovelace', dateOfBirth: '1990-12-10', city: 'Ottawa',
      salary: 85000, gender: 'F', email: 'ada@example.com'
    });
    component.onSubmit();
    await fixture.whenStable();

    expect(service.addEmployee).toHaveBeenCalledTimes(1);
    const saved = service.addEmployee.calls.mostRecent().args[0];
    expect(saved.name).toBe('Ada Lovelace');
    expect(saved.dateOfBirth instanceof Date).toBeTrue();
    expect(router.navigate).toHaveBeenCalledWith(['/employees']);
  });

  it('shows an error when Firestore refuses the write', async () => {
    service.addEmployee.and.returnValue(Promise.reject(new Error('permission-denied')));
    component.employeeForm.setValue({
      name: 'Ada', dateOfBirth: '1990-12-10', city: 'Ottawa', salary: 1, gender: '', email: ''
    });
    component.onSubmit();
    await fixture.whenStable();
    expect(component.errorMessage).toContain('permission-denied');
  });
});
