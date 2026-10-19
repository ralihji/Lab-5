import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  Timestamp,
  addDoc,
  collection,
  collectionData,
  orderBy,
  query
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Employee } from '../model/employee';

/** Forme d'un employé tel qu'il est stocké dans Firestore. */
interface EmployeeDoc {
  id?: string;
  name: string;
  dateOfBirth: Timestamp;
  city: string;
  salary: number;
  gender?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private firestore: Firestore = inject(Firestore);
  private readonly employeesCollection = collection(this.firestore, 'employees');

  /**
   * 2. Récupère tous les employés enregistrés dans Firestore.
   * Le flux se met à jour en temps réel quand un employé est ajouté.
   */
  get $(): Observable<readonly Employee[]> {
    const q = query(this.employeesCollection, orderBy('name'));
    return (collectionData(q, { idField: 'id' }) as Observable<EmployeeDoc[]>).pipe(
      map(docs => docs.map(d => {
        const employee = new Employee(
          d.name,
          d.dateOfBirth?.toDate ? d.dateOfBirth.toDate() : new Date(d.dateOfBirth as unknown as string),
          d.city,
          d.salary,
          d.gender,
          d.email
        );
        employee.id = d.id ?? null;
        return employee;
      }))
    );
  }

  /** 1. Enregistre un employé dans la collection « employees » de Firestore. */
  addEmployee(employee: Employee) {
    // Firestore n'accepte que des objets simples (pas d'instance de classe ni de valeur undefined).
    const data: Record<string, unknown> = {
      name: employee.name,
      dateOfBirth: Timestamp.fromDate(employee.dateOfBirth),
      city: employee.city,
      salary: Number(employee.salary)
    };
    if (employee.gender) { data['gender'] = employee.gender; }
    if (employee.email) { data['email'] = employee.email; }
    return addDoc(this.employeesCollection, data);
  }
}
