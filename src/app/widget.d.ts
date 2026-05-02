export interface IWidgetPanel {
    title: string;
    tooltip: string;
    description: string[];
    amount: number; // calculated, unless static (amountPerDay = 0)
    amountPerDay: number; // 0 if static
    currency: string;
    startDate: Date;
    endDate?: Date;
    calculatedItems: IWidgetCalculatedItem[];
    references: string[];
}

export interface IWidgetCalculatedItem {
    amount: number; // number of items at the current moment
    currency: string;
    description: string;
    costPerItem: number;
    itemCount: number;
};
