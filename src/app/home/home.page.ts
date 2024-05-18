import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DataService } from '../services/data.service';
import { IonInfiniteScroll, IonItem } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll | undefined;
  // @ViewChild('itemList', { read: ElementRef }) itemList: ElementRef | undefined;
  @ViewChildren('listItem') listItems: QueryList<IonItem> | undefined;
  
  
  data: any[] = [];
  page: number = 0;
  lastReadItem: any = null;
  hasScrolledToLastRead: boolean = false;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadLastRead();
    this.loadInitialData();
  }

  ngAfterViewInit() {
    this.scrollToLastRead();
    // this.loadLastRead();
  }

  loadInitialData() {
    this.dataService.loadData().subscribe((data) => {
      this.dataService.setAllData(data);
      this.loadMoreData();
    });
  }

  loadMoreData(event?: { target: { complete: () => void; }; } | undefined) {
    this.dataService.getData(this.page).subscribe((newData) => {
      this.data = [...this.data, ...newData];
      this.page++;
      if (event) {
        event.target.complete();
      }
      if (newData.length < 20) {
        this.infiniteScroll!.disabled = true;
      }
      this.scrollToLastRead();
    });
  }

  loadData(event: any) {
    this.loadMoreData(event);
  }

  saveLastRead(item: any) {
    this.lastReadItem = item;
    localStorage.setItem('lastRead', JSON.stringify(item));
  }

  loadLastRead() {
    const savedItem = localStorage.getItem('lastRead');
    if (savedItem) {
      this.lastReadItem = JSON.parse(savedItem);
      // alert(`Last read item: ${this.lastReadItem.name}`);
      // this.scrollToLastRead();
    }
  }

  scrollToLastRead() {
    if (this.lastReadItem && this.data.length > 0 && !this.hasScrolledToLastRead) {
      const index = this.data.findIndex(item => item.id === this.lastReadItem.id);
      if (index >= 0) {
        setTimeout(() => {
          const listItem = this.listItems?.toArray()[index];
          if (listItem) {
            const nativeElement = listItem['el'];
            // listItem.el.scrollIntoView({ behavior: 'smooth' });
            nativeElement.scrollIntoView({ behavior: 'smooth' });
            this.hasScrolledToLastRead = true;
            
          }
        }, 0);
      }
    }
  }

}
