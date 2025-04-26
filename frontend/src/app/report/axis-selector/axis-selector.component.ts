import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface AxisSelection {
  totalEtp: boolean;
  etpRo: boolean;
}

@Component({
  selector: 'app-axis-selector',
  templateUrl: './axis-selector.component.html',
  styleUrls: ['./axis-selector.component.css']
})
export class AxisSelectorComponent {
  @Input() selection: AxisSelection = { totalEtp: false, etpRo: false };
  @Output() selectionChange = new EventEmitter<AxisSelection>();

  onCheckboxChange(): void {
    this.selectionChange.emit(this.selection);
  }
}