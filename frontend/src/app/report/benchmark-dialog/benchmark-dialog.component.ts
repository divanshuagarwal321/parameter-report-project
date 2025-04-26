import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';

interface BenchmarkData {
  total_etp: number | null;
  etp_ro: number | null;
}

@Component({
  selector: 'app-benchmark-dialog',
  templateUrl: './benchmark-dialog.component.html',
  styleUrls: ['./benchmark-dialog.component.css']
})
export class BenchmarkDialogComponent {
  benchmarkData: BenchmarkData = {
    total_etp: null,
    etp_ro: null
  };

  numberPattern = '^[0-9]*.?[0-9]*$';

  constructor(
    public dialogRef: MatDialogRef<BenchmarkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: BenchmarkData
  ) {
    this.benchmarkData = {
      total_etp: null,
      etp_ro: null
    };
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.dialogRef.close(this.benchmarkData);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  isFormValid(): boolean {
    return this.benchmarkData.total_etp !== null || this.benchmarkData.etp_ro !== null;
  }
}
