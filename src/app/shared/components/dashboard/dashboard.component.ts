import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilityService } from '../../services/utility.service';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardApiResponse, MonthlyData } from '../../models/dashboard.model';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {

  dashboardData: DashboardApiResponse | null = null;
  monthlyData: MonthlyData | null = null;
  isLoading: boolean = true;
  chart: Chart | null = null;
  dataLoaded: boolean = false;

  constructor(
    private _utilityService: UtilityService,
    private _dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    if (this.dataLoaded) {
      setTimeout(() => this.initializeChart(), 100);
    }
  }

  loadDashboardData(): void {
    this._utilityService.showLoader(true);
    this._dashboardService.getDashboardData().subscribe({
      next: (response: DashboardApiResponse) => {
        this.dashboardData = response;
        this.monthlyData = response.Result.MonthlyData;
        this.isLoading = false;
        this.dataLoaded = true;
        this._utilityService.showLoader(false);
        // Initialize chart after DOM is ready
        setTimeout(() => this.initializeChart(), 100);
      },
      error: (error: any) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
        this._utilityService.showLoader(false);
        // Handle error appropriately
      }
    });
  }

  initializeChart(): void {
    if (!this.monthlyData) {
      console.warn('Monthly data is not available');
      return;
    }

    const ctx = document.getElementById('dashboardChart') as HTMLCanvasElement;

    if (!ctx) {
      console.error('Canvas element with id "dashboardChart" not found');
      return;
    }

    const months = Object.keys(this.monthlyData);
    const pendingData = months.map(month => this.monthlyData![month].PendingBookings);
    const confirmedData = months.map(month => this.monthlyData![month].ConfirmedBookings);
    const completedData = months.map(month => this.monthlyData![month].CompletedBookings);
    const canceledData = months.map(month => this.monthlyData![month].CanceledBookings);

    try {
      if (this.chart) {
        this.chart.destroy();
      }

      const config: ChartConfiguration<'bar'> = {
        type: 'bar',
        data: {
          labels: months,
          datasets: [
            {
              label: 'Pending Bookings',
              data: pendingData,
              backgroundColor: '#FDB913',
              borderColor: '#FDB913',
              borderWidth: 1
            },
            {
              label: 'Confirmed Bookings',
              data: confirmedData,
              backgroundColor: '#4CAF50',
              borderColor: '#4CAF50',
              borderWidth: 1
            },
            {
              label: 'Completed Bookings',
              data: completedData,
              backgroundColor: '#2196F3',
              borderColor: '#2196F3',
              borderWidth: 1
            },
            {
              label: 'Canceled Bookings',
              data: canceledData,
              backgroundColor: '#F44336',
              borderColor: '#F44336',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: {
                  size: 12
                },
                padding: 15
              }
            },
            title: {
              display: true,
              text: 'Monthly Booking Statistics',
              font: {
                size: 16,
                weight: 'bold'
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              },
              title: {
                display: true,
                text: 'Number of Bookings'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Months'
              }
            }
          }
        }
      };

      this.chart = new Chart(ctx, config);
      console.log('Chart initialized successfully');
    } catch (error) {
      console.error('Error initializing chart:', error);
    }
  }

}
