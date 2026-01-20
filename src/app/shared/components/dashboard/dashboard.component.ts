import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilityService } from '../../services/utility.service';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardApiResponse, MonthlyData, RevenueData } from '../../models/dashboard.model';
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
  revenueChartMonth: Chart | null = null;
  revenueChartYear: Chart | null = null;
  dataLoaded: boolean = false;
  currentMonth: string = '';
  mostCustomerName: string = '';
  mostMassageName: string = '';
  mostAssignedTherapist: string = '';
  currentMonthRevenue: RevenueData | null = null;
  yearlyRevenue: RevenueData | null = null;

  constructor(
    private _utilityService: UtilityService,
    private _dashboardService: DashboardService
  ) {
    this.currentMonth = this.getCurrentMonthName();
  }

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
        this.mostCustomerName = response.Result.MostCustomerName;
        this.mostMassageName = response.Result.MostMassageName;
        this.mostAssignedTherapist = response.Result.MostAssignedTherapist;
        this.currentMonthRevenue = response.Result.CurrentMonthRevenue;
        this.yearlyRevenue = response.Result.YearlyRevenue;
        this.isLoading = false;
        this.dataLoaded = true;
        this._utilityService.showLoader(false);
        // Initialize chart after DOM is ready
        setTimeout(() => {
          this.initializeChart();
          this.initializeRevenueCharts();
        }, 100);
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

  initializeRevenueCharts(): void {
    this.initializeRevenueChart('revenueChartMonth', this.currentMonthRevenue);
    this.initializeRevenueChart('revenueChartYear', this.yearlyRevenue);
  }

  initializeRevenueChart(chartId: string, revenueData: RevenueData | null): void {
    if (!revenueData) return;

    const ctx = document.getElementById(chartId) as HTMLCanvasElement;
    if (!ctx) return;

    try {
      // Destroy existing chart if it exists
      const existingChart = Chart.getChart(ctx);
      if (existingChart) {
        existingChart.destroy();
      }

      const chartInstance = chartId === 'revenueChartMonth' ? this.revenueChartMonth : this.revenueChartYear;
      if (chartInstance) {
        chartInstance.destroy();
      }

      const config: ChartConfiguration<'doughnut'> = {
        type: 'doughnut',
        data: {
          labels: ['Paid Amount', 'Delivery Amount', 'Discount Amount', 'Wallet Used'],
          datasets: [
            {
              data: [
                revenueData.PaidAmount,
                revenueData.DeliveryAmount,
                revenueData.DiscountAmount,
                revenueData.WalletAmountUsed
              ],
              backgroundColor: [
                '#4CAF50',
                '#2196F3',
                '#FF9800',
                '#9C27B0'
              ],
              borderColor: '#fff',
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: {
                  size: 12
                },
                padding: 15
              }
            }
          }
        }
      };

      const newChart = new Chart(ctx, config);
      if (chartId === 'revenueChartMonth') {
        this.revenueChartMonth = newChart;
      } else {
        this.revenueChartYear = newChart;
      }
      console.log(`${chartId} initialized successfully`);
    } catch (error) {
      console.error(`Error initializing ${chartId}:`, error);
    }
  }

  getRevenueTotal(revenue: RevenueData | null): number {
    if (!revenue) return 0;
    return revenue.PaidAmount + revenue.DeliveryAmount + revenue.DiscountAmount + revenue.WalletAmountUsed;
  }

  getCurrentMonthName(): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    return months[currentDate.getMonth()];
  }
}
