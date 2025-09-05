import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule], // RouterOutlet se importa aquí
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {}
