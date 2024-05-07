export interface BycriptRepository {
  compare(password: string, passwordHash: string): Promise<any>
  create(password: string): Promise<any>
}