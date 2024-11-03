import {AfterViewInit, Component, OnInit} from '@angular/core';
import {TransactionService} from "../../services/transaction.service";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from "@angular/material/table";
import {
  FormsModule,
  ReactiveFormsModule
} from "@angular/forms";
import {MatFormField, MatFormFieldModule, MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {KeyValuePipe, NgClass, NgForOf} from "@angular/common";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatMenu, MatMenuContent, MatMenuTrigger} from "@angular/material/menu";
import {MatCheckbox} from "@angular/material/checkbox";
import {
  MatDatepicker,
  MatDatepickerActions,
  MatDatepickerApply,
  MatDatepickerCancel, MatDatepickerInput, MatDatepickerModule, MatDatepickerToggle
} from "@angular/material/datepicker";
import {MatNativeDateModule, provideNativeDateAdapter} from "@angular/material/core";
import {RouterLink} from "@angular/router";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {Transaction} from "../../models/Transaction";
import {Chart, ChartType, registerables} from "chart.js";
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatButton,
    MatTable,
    MatCellDef,
    MatHeaderCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    ReactiveFormsModule,
    NgClass,
    MatIcon,
    MatIconModule,
    MatSelect,
    NgForOf,
    KeyValuePipe,
    MatOption,
    FormsModule,
    MatMenu,
    MatMenuTrigger,
    MatMenuContent,
    MatCheckbox,
    MatDatepicker,
    MatDatepickerActions,
    MatDatepickerApply,
    MatDatepickerCancel,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatHint,
    MatInput,
    MatLabel,
    MatSuffix,
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerInput,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButton,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    RouterLink,
    MatRadioGroup,
    MatRadioButton,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  protected transactions: any;
  unorderedNum!: number;
  chart: any = [];
  private transactionsAmounts: number[] = [];
  maximum: any;
  labels: any = [];
  transactionsData: any;

  constructor(private transactionService: TransactionService) {

  }

  ngOnInit(): void {
    console.log('============ DASHBOARD LOADED =============');
  }

  ngAfterViewInit() {
    this.getData();
  }

  getData() {
    this.transactionService.getAllTransactions().subscribe(res => {

      this.transactions = res;
      this.sortTransactions(); // by the date property

      this.transactions.map((b: any) => {
        this.transactionsAmounts.push(b.amount);
        this.labels.push(b.name);

        let parsedDate = new Date(Date.parse(b.date));
        parsedDate.setDate(parsedDate.getDate() + 14);

        console.log(parsedDate);
      })

      const data = {
        labels: this.labels,
        datasets: [
          {
            label: 'Money Flow',
            data: this.transactionsAmounts,
            borderColor: '#6ace95',
            backgroundColor: 'rgba(219,255,231,0.49)',
            fill: true,
            tension: 0.4
          }
        ]
      };

      this.chart = new Chart('graph', {
        type: 'line' as ChartType,
        data: data,
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Chart.js Line Chart - Cubic interpolation mode'
            },
          },
          interaction: {
            intersect: false,
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Amount'
              },
              // suggestedMin: -10,
              // suggestedMax: 200
            }
          }
        },
      });

      this.unorderedNum = Math.round((Math.max(...this.transactionsAmounts) - Math.min(...this.transactionsAmounts)) / 10);
      this.maximum = Math.ceil(Math.max(...this.transactionsAmounts)/100) * 100;

    })
  }

  sortTransactions() {
    // @ts-ignore
    this.transactions.sort((a: Transaction, b: Transaction) => new Date(a.date) - new Date(b.date));
    console.log(this.transactions);
  }
}

