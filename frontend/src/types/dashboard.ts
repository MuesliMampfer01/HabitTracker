export interface BaseItem {
    id: number;
    title: string;
    category?: string;
    description?: string;
}

export interface HabitItem extends BaseItem {
    type: 'habit';
    streak: number;
    is_completed_today: boolean;
}

export interface ChoreItem extends BaseItem {
    type: 'chore';
    is_completed: boolean;
    due_date?: string;
}

export type DashboardItem = HabitItem | ChoreItem;
