import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { EChartsOption, LineSeriesOption } from 'echarts';
import { MatDialog } from '@angular/material/dialog';
import { BenchmarkDialogComponent } from './benchmark-dialog/benchmark-dialog.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { AxisSelection } from './axis-selector/axis-selector.component';

interface Parameter {
  date: string;
  total_etp: number;
  etp_ro: number;
}

interface Benchmarks {
  total_etp: number | null;
  etp_ro: number | null;
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  parameters: Parameter[] = [];
  chartOption: EChartsOption = {};
  multiAxis = false;
  benchmarks: Benchmarks = {
    total_etp: null,
    etp_ro: null
  };
  axisSelection: AxisSelection = {
    totalEtp: false,
    etpRo: false
  };

  private readonly TOTAL_ETP_COLOR = '#5470c6';
  private readonly ETP_RO_COLOR = '#91cc75';

  constructor(
    private dataService: DataService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadData();
  }


  loadData(): void {
    this.dataService.getParameters().subscribe((data: Parameter[]) => {
      this.parameters = data;
      this.updateChart();
    });
  }

  updateChart(): void {
    const dates = this.parameters.map(p => p.date.split('T')[0]);
    const totalEtp = this.parameters.map(p => p.total_etp);
    const etpRo = this.parameters.map(p => p.etp_ro);

    const minValue = Math.min(
      Math.min(...totalEtp),
      Math.min(...etpRo),
      this.benchmarks.total_etp || 0,
      this.benchmarks.etp_ro || 0
    );

    const maxValue = Math.max(
      Math.max(...totalEtp),
      Math.max(...etpRo),
      this.benchmarks.total_etp || 0,
      this.benchmarks.etp_ro || 0
    );

    const padding = (this.axisSelection.totalEtp || this.axisSelection.etpRo) ? 20 : 10;
    const yAxisMin = Math.floor(minValue / 10) * 10 - padding;
    const yAxisMax = Math.ceil(maxValue / 10) * 10 + padding;
    const interval = 20;

    const yAxisConfig = {
      type: 'value' as const,
      min: yAxisMin,
      max: yAxisMax,
      interval: interval,
      axisLabel: {
        formatter: '{value}'
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: '#E0E0E0'
        }
      }
    };

    const series: LineSeriesOption[] = [];

    series.push({
      name: 'Total ETP recovery(%)',
      type: 'line',
      data: totalEtp,
      yAxisIndex: this.axisSelection.totalEtp ? 0 : 0,
      color: this.TOTAL_ETP_COLOR,
      markLine: this.benchmarks.total_etp !== null ? {
        data: [{ yAxis: this.benchmarks.total_etp }]
      } : undefined
    } as LineSeriesOption);

    series.push({
      name: 'ETP RO Recovery(%)',
      type: 'line',
      data: etpRo,
      yAxisIndex: this.axisSelection.etpRo ? (this.axisSelection.totalEtp ? 1 : 0) : 0,
      color: this.ETP_RO_COLOR,
      markLine: this.benchmarks.etp_ro !== null ? {
        data: [{ yAxis: this.benchmarks.etp_ro }]
      } : undefined
    } as LineSeriesOption);

    const yAxisIndices = [0];
    if (this.axisSelection.totalEtp && this.axisSelection.etpRo) {
      yAxisIndices.push(1);
    }

    this.chartOption = {
      tooltip: {
        trigger: 'axis',
        formatter: '{b}<br/>{a}: {c}'
      },
      legend: {
        data: ['Total ETP recovery(%)', 'ETP RO Recovery(%)'],
        top: '0px',
        textStyle: {
          color: '#ffffff'
        }
      },
      grid: {
        left: '100px',
        right: '100px',
        bottom: '80px',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: {
          rotate: 0
        }
      },
      yAxis: this.getYAxisConfig(yAxisConfig),
      dataZoom: [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          bottom: 20,
          height: 20,
          borderColor: 'transparent',
          showDetail: false,
          backgroundColor: '#1a2942',
          fillerColor: 'rgba(144, 160, 183, 0.4)',
          handleStyle: {
            color: '#90a0b7',
            borderColor: '#90a0b7'
          },
          moveHandleStyle: {
            color: '#90a0b7'
          },
          selectedDataBackground: {
            lineStyle: {
              color: '#90a0b7'
            },
            areaStyle: {
              color: '#90a0b7'
            }
          }
        },
        {
          type: 'slider',
          show: true,
          yAxisIndex: yAxisIndices,
          left: 20,
          width: 20,
          borderColor: 'transparent',
          showDetail: false,
          backgroundColor: '#1a2942',
          fillerColor: 'rgba(144, 160, 183, 0.4)',
          handleStyle: {
            color: '#90a0b7',
            borderColor: '#90a0b7'
          },
          moveHandleStyle: {
            color: '#90a0b7'
          }
        },
        {
          type: 'inside',
          xAxisIndex: [0],
          yAxisIndex: yAxisIndices
        }
      ],
      series: series
    };
  }

  private getYAxisConfig(baseConfig: any): any[] | any {
    if (!this.axisSelection.totalEtp && !this.axisSelection.etpRo) {
      return {
        ...baseConfig,
        axisLine: {
          show: true
        }
      };
    }

    const axes = [];
    if (this.axisSelection.totalEtp) {
      axes.push({
        ...baseConfig,
        position: 'right',
        offset: 0,
        axisLine: {
          show: true,
          lineStyle: {
            color: this.TOTAL_ETP_COLOR
          }
        }
      });
    }
    if (this.axisSelection.etpRo) {
      axes.push({
        ...baseConfig,
        position: 'right',
        offset: this.axisSelection.totalEtp ? 60 : 0,
        axisLine: {
          show: true,
          lineStyle: {
            color: this.ETP_RO_COLOR
          }
        }
      });
    }
    return axes;
  }

  onAxisSelectionChange(selection: AxisSelection): void {
    this.axisSelection = selection;
    this.updateChart();
  }

  openBenchmarkDialog(): void {
    const dialogRef = this.dialog.open(BenchmarkDialogComponent, {
      width: '500px',
      data: this.benchmarks,
      autoFocus: false,
      position: { top: '100px' },
      panelClass: 'benchmark-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.benchmarks = result;
        this.updateChart();
      }
    });
  }
}
