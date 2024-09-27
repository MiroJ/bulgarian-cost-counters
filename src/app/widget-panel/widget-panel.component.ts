import { Component, Input, OnInit } from '@angular/core';
import { IWidgetPanel } from '../widget';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-widget-panel',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './widget-panel.component.html',
})
export class WidgetPanelComponent implements OnInit {
    @Input() data!: IWidgetPanel;

    ngOnInit(): void {
        if (this.data.startDate) {
            this.data.startDate = new Date(this.data.startDate);
            setInterval(() => {
                this.calculateAllItems();
            }, 200);

        }
    }

    private calculateAllItems(): void {
        this.data.amount = this.calculateCurrentAmount(1);
        this.data.calculatedItems.forEach((item) => {
            if (item.costPerItem) {
                item.amount = this.calculateCurrentAmount(item.costPerItem);
            }
        });
    }

    private calculateCurrentAmount(costPerItem: number): number {
        const now = new Date();
        const elapsedDays = Math.abs(now.getTime() - this.data.startDate.getTime()) / (1000 * 60 * 60 * 24);
        return Math.round(elapsedDays * this.data.amountPerDay / costPerItem);
    }
}
