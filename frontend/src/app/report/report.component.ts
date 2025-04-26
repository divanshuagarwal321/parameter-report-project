import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { EChartsOption } from 'echarts';

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

  constructor(private dataService: DataService) { }

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
    const dates = this.parameters.map(p => p.date);
    const totalEtp = this.parameters.map(p => p.total_etp);
    const etpRo = this.parameters.map(p => p.etp_ro);

    this.chartOption = {
      title: {
        text: 'Total ETP Recovery & Total ETP RO Recovery %',
        left: 'center',
        top: 0
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Total ETP recovery(%)', 'ETP RO Recovery(%)'],
        top: '30px'
      },
      xAxis: {
        type: 'category',
        data: dates
      },
      yAxis: this.multiAxis ? [
        {
          type: 'value',
          name: 'Total ETP',
          position: 'left'
        },
        {
          type: 'value',
          name: 'ETP RO',
          position: 'right'
        }
      ] : {
        type: 'value'
      },
      series: [
        {
          name: 'Total ETP recovery(%)',
          type: 'line',
          data: totalEtp,
          yAxisIndex: 0,
          markLine: this.benchmarks.total_etp !== null ? {
            data: [{ yAxis: this.benchmarks.total_etp }]
          } : undefined
        },
        {
          name: 'ETP RO Recovery(%)',
          type: 'line',
          data: etpRo,
          yAxisIndex: this.multiAxis ? 1 : 0,
          markLine: this.benchmarks.etp_ro !== null ? {
            data: [{ yAxis: this.benchmarks.etp_ro }]
          } : undefined
        }
      ]
    };
  }

  toggleMultiAxis(): void {
    this.multiAxis = !this.multiAxis;
    this.updateChart();
  }

  setBenchmark(parameter: keyof Benchmarks): void {
    const value = prompt(`Enter benchmark value for ${parameter}:`);
    if (value !== null) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        this.benchmarks[parameter] = numValue;
        this.updateChart();
      }
    }
  }
}
