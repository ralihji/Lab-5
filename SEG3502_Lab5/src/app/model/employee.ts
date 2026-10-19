export class Employee {
  public id?: string | null;

  constructor(
    public name: string,
    public dateOfBirth: Date,
    public city: string,
    public salary: number,
    public gender?: string,
    public email?: string
  ) {
    this.id = null;
  }
}
