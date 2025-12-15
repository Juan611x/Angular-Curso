import { AfterViewInit, Component, ElementRef, signal, viewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import { JsonPipe } from '@angular/common';

interface Marker {
  id: string;
  marker: mapboxgl.Marker;
}

mapboxgl.accessToken = environment.mapboxKey;

@Component({
  selector: 'app-markers-page',
  imports: [JsonPipe],
  templateUrl: './markers-page.html',
  styleUrl: './markers-page.css',
})
export class MarkersPage implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  map = signal<mapboxgl.Map | null>(null);
  markers = signal<Marker[]>([]);

  async ngAfterViewInit() {
    if (!this.divElement()?.nativeElement) return;
    await new Promise((resolve) => setTimeout(resolve, 100));

    const element = this.divElement()!.nativeElement;
    const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-122.40985, 37.793085], // starting position [lng, lat]
      zoom: 14, // starting zoom
    });

    const market = new mapboxgl.Marker({ draggable: false })
      .setLngLat([-122.40985, 37.793085])
      .addTo(map);

    this.mapListeners(map);
  }

  mapListeners(map: mapboxgl.Map) {
    map.on('click', (event) => {
      this.mapClick(event);
    });
    this.map.set(map);
  }

  mapClick(event: mapboxgl.MapMouseEvent) {
    if (!this.map()) return;
    const color = '#xxxxxx'.replace(/x/g, (y) => ((Math.random() * 16) | 0).toString(16));
    const marker = new mapboxgl.Marker({ draggable: false, color })
      .setLngLat(event.lngLat)
      .addTo(this.map()!);

    const newMarker: Marker = {
      id: new Date().getTime().toString(),
      marker: marker,
    };
    this.markers.update((markers) => [...markers, newMarker]);
  }

  flyToMarker(lngLat: LngLatLike) {
    if (!this.map()) return;
    this.map()!.flyTo({ center: lngLat });
  }

  deleteMarker(id: string) {
    if (!this.map()) return;
    const markerToDelete = this.markers().find((m) => m.id === id);
    if (!markerToDelete) return;

    markerToDelete.marker.remove();
    this.markers.update((markers) => markers.filter((m) => m.id !== id));
  }
}
