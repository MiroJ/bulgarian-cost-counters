import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IWidgetPanel } from '../widget';
import { NumberToWordsBgPipe } from '../number-to-words-bg.pipe';

@Component({
    selector: 'app-widget-panel',
    standalone: true,
    imports: [CommonModule, NumberToWordsBgPipe],
    templateUrl: './widget-panel.component.html',
})
export class WidgetPanelComponent implements OnInit {
    @Input() data!: IWidgetPanel;
    @Input() isCollapsed = false;

    public expanded = true;

    ngOnInit(): void {
        if (this.data.startDate) {
            this.data.startDate = new Date(this.data.startDate);
            setInterval(() => {
                this.calculateAllItems();
            }, 200);
        } else {
            // Calculate numbers for each child item
            this.data.calculatedItems.forEach((item) => {
                item.amount = this.calculateFixedAmount(item.costPerItem, item.itemCount);
            });
        }
    }

    private calculateAllItems(): void {
        const now = new Date();
        const endDate = this.data.endDate ? new Date(this.data.endDate) : now;
        const lastDate = endDate && endDate < now ? endDate : now;
        const elapsedDays = Math.abs(lastDate.getTime() - this.data.startDate.getTime()) / (1000 * 60 * 60 * 24);
        // Calculate the current amount
        this.data.amount = this.calculateCurrentAmount(elapsedDays, 1, 0);
        // Calculate numbers for each child item
        this.data.calculatedItems.forEach((item) => {
            item.amount = this.calculateCurrentAmount(elapsedDays, item.costPerItem, item.itemCount);
        });
    }

    private calculateCurrentAmount(elapsedDays: number, costPerItem: number, itemCount: number): number {
        if (costPerItem) {
            return Math.round(elapsedDays * this.data.amountPerDay / costPerItem); // total items
        } else if (itemCount) {
            return Math.round(100 * elapsedDays * this.data.amountPerDay / itemCount) / 100; // per item
        } else {
            return 0;
        }
    }

    private calculateFixedAmount(costPerItem: number, itemCount: number): number {
        if (costPerItem) {
            return Math.round(this.data.amount / costPerItem); // total items
        } else if (itemCount) {
            return Math.round(100 * this.data.amount / itemCount) / 100; // per item
        } else {
            return 0;
        }
    }
}
