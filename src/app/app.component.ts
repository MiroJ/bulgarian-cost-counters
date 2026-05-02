import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WidgetPanelComponent } from "./widget-panel/widget-panel.component";
import { IWidgetPanel } from './widget';
import * as data from '../data.json';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, CommonModule, WidgetPanelComponent],
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    public widgets!: IWidgetPanel[];

    constructor() {
        this.widgets = (data as any).default;
    }

    ngOnInit(): void {
    }

}
