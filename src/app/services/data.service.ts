import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  private dataUrl: string = 'assets/data/data.json';
  private allData: any[] = [];
  private pageSize: number = 20;

  constructor(private http: HttpClient) { }

  loadData(): Observable<any[]> {
    if (this.allData.length === 0) {
      return this.http.get<any[]>(this.dataUrl);
    } else {
      return of(this.allData);
    }
  }

  getData(page: number): Observable<any[]> {
    const start = page * this.pageSize;
    const end = start + this.pageSize;
    return of(this.allData.slice(start, end));
  }

  setAllData(data: any[]) {
    this.allData = data;
  }
}
