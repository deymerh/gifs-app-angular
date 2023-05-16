import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs.interface';

const GIPHY_API_KEY = 'PWFYDwUb1gr0BWHKD1NROMwoXg3V6ye1';
const BASE_URL = 'https://api.giphy.com/v1/gifs';

@Injectable({ providedIn: 'root' })
export class GifsService {
  private _tagsHistory: string[] = [];
  public gifList: Gif[] = [];

  constructor(private readonly http: HttpClient) {
    this.loadLocalStorage();
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();
    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }
    this._tagsHistory.unshift(tag);
    this._tagsHistory = this.tagsHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  searchTag(tag: string): void {
    if (tag.length === 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', GIPHY_API_KEY)
      .set('q', tag)
      .set('limit', 10)

    this.http.get<SearchResponse>(`${BASE_URL}/search`, { params })
      .subscribe(((response) => {
        this.gifList = response.data;
        console.log({ gifs: this.gifList });
      }))
  }

  saveLocalStorage(): void {
    window.localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  loadLocalStorage(): void {
    if (!window.localStorage.getItem('history')) return;
    this._tagsHistory = JSON.parse(window.localStorage.getItem('history')!);
    this.searchTag(this._tagsHistory[0]);
  }

}
