import { TestBed } from '@angular/core/testing';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { EmployeeService } from './employee.service';

describe('EmployeeService', () => {
  let service: EmployeeService;

  beforeEach(() => {
    // Projet factice : aucune requête réseau n'est faite, on vérifie seulement que le service se construit.
    TestBed.configureTestingModule({
      providers: [
        provideFirebaseApp(() => initializeApp({ projectId: 'demo-test', apiKey: 'test', appId: 'test' })),
        provideFirestore(() => getFirestore())
      ]
    });
    service = TestBed.inject(EmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
