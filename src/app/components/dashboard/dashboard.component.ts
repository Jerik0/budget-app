import {AfterViewInit, Component, ElementRef, HostListener, inject, OnInit, ViewChild} from '@angular/core';
import {BillService} from "../../services/bill.service";
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
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {MatFormField, MatFormFieldModule, MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {KeyValuePipe, NgClass, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatDialog} from "@angular/material/dialog";
import {MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {SelectionModel} from "@angular/cdk/collections";
import {MatCheckbox} from "@angular/material/checkbox";
import {CreateBillDialogComponent} from "../dialogs/create-bill-dialog/create-bill-dialog.component";
import category from "../../enums/Category";
import ChargeType from "../../enums/ChargeType";
import {
  MatDatepicker,
  MatDatepickerActions,
  MatDatepickerApply,
  MatDatepickerCancel, MatDatepickerInput, MatDatepickerModule, MatDatepickerToggle
} from "@angular/material/datepicker";
import {MatNativeDateModule, provideNativeDateAdapter} from "@angular/material/core";
import {Frequency} from "../../enums/Frequency";
import {RouterLink} from "@angular/router";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {Bill} from "../../models/Bill";

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
    MatRadioButton
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('graph') graph!: ElementRef<HTMLCanvasElement>;
  private canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;
  protected bills: any;
  graphHeight: number = 400;
  graphWidth: number = 800;
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  startX: number = 30;
  startY: number = 30;
  offsetX!: number;
  offsetY!: number;
  canvasHeight!: number;
  canvasWidth!: number;
  unorderedNum!: number;
  rowsCount = 0;
  columnsCount!: number;
  increment!: number; // bottom information interval

  private billsAmounts: number[] = [];
  maximum: any;

  constructor(private billService: BillService) {

  }

  ngOnInit(): void {
    console.log('============ DASHBOARD LOADED =============');

  }

  ngAfterViewInit() {
    this.getData();
    this.canvas = this.graph.nativeElement;
    this.context = this.canvas.getContext('2d')!;
    this.canvasHeight = this.canvas.height;
    this.canvasWidth = this.canvas.width;
    this.offsetX = this.canvasWidth - this.startX;
    this.offsetY = this.canvasHeight - this.startY;
    console.log(this.canvas.getBoundingClientRect());

    this.drawCanvas();
  }

  getData() {
    this.billService.getAllBills().subscribe(res => {

      this.bills = res;
      this.sortBills(); // by the date property

      this.bills.map((b: any) => {
        this.billsAmounts.push(b.amount);

      })

      this.increment = (this.canvas.width-40) / this.bills.length;

      // the increment at which the y texts will increase
      this.unorderedNum = Math.round((Math.max(...this.billsAmounts) - Math.min(...this.billsAmounts)) / 10);
      this.maximum = Math.ceil(Math.max(...this.billsAmounts)/100) * 100;
      console.log(this.maximum);
      console.log('orderedNum:', this.unorderedNum);
      // this.mapData();
      this.mapAdvancedData();
    })
  }

  sortBills() {
    // @ts-ignore
    this.bills.sort((a: Bill, b: Bill) => new Date(a.date) - new Date(b.date));
    console.log(this.bills);
  }

  drawCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = 'rgba(0,0,0,0.2)';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  mapData() {
    this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
    this.context.beginPath();

    this.bills.map((bill: any, i: number) => {
      //
      let lastX = Math.floor(this.canvas.width / this.bills.length) * i;
      let lastY = this.canvas.height - Math.floor((bill.amount / this.maximum) * (this.canvas.height - 10));
      // console.log('lastX:', lastX);
      // console.log('lastY:', lastY);

      this.context.lineTo(lastX, lastY);
      this.context.strokeStyle = '#87fdd3';
      this.context.fillStyle = '#edf5f3';
      this.context.fillText(bill.amount, lastX + 15, lastY + 2);
      this.context.stroke();
    })
  }

  mapAdvancedData() {
    this.context.clearRect(0,0, this.canvas.width, this.canvas.height);

    let currentY = 1; // where to start drawing the horizontal lines, vertically
    let currentX = 60; // where to start drawing the vertical lines, horizontally

    this.context.strokeStyle = '#a7a7a7';


    // draw vertical lines
    while (currentX < this.canvasWidth) {
      this.context.beginPath();
      this.context.moveTo(currentX, 0);
      this.context.lineTo(currentX, this.canvasHeight-40);
      this.context.stroke();
      currentX += this.startX;
    }

    // draw horizontal lines
    while (currentY < this.offsetY) {
      this.context.beginPath();
      this.context.moveTo(60, currentY);
      this.context.lineTo(this.canvasWidth-10, currentY);
      this.context.stroke();
      currentY += this.startY;
      console.log('currentY: ', currentY);
      console.log('offsetY: ', this.offsetY);
      if (currentY < this.offsetY) this.rowsCount += 1;
    }

    this.setGraphText();
  }

  setGraphText() {
    console.log('rows count: ' + this.rowsCount);
    let y = 30;
    let x = 50;
    let n = this.maximum;
    console.log(n);

    for (let bill of this.bills) {
      this.context.font=  '12px arial';
      this.context.fillStyle = '#fff';
      // generate the dates on the graph, formatted with just mm-dd
      this.context.fillText(bill.date.slice(5, 10), x, this.canvas.height - 10);
      x += this.increment;
    }

    this.context.font = '11px arial';
    this.context.fillStyle = '#fff';
    // let incrementer = this.maximum;
    console.log(this.maximum / this.rowsCount);

    for (let i = 0; i < (this.rowsCount - 1); i++) {
      // if (i === this.rowsCount - 1) continue;
      this.context.fillText(n.toString(), 10, y + 5);
      n -= Math.round(this.maximum / (this.rowsCount - 2));
      y += this.startX;
    }

    this.drawGraph();
  }

  drawGraph() {
    // draw ==========
    this.context.save();
    this.context.strokeStyle = '#87fdd3';
    this.context.lineWidth = 2;
    this.context.beginPath();

    // horizontal starting point for the actual graphical information
    let x = 40;
    let line = 30;
    console.log(this.billsAmounts);

    for (let bill of this.bills) {
      let start;
      let max = Math.max(...this.billsAmounts, start = 30);
      while (max >= bill.amount) {
        max = max - 1;
        start += (line / this.unorderedNum);
      }
      this.context.fillText(bill.amount, x + 35, start + 5);
      this.context.lineTo(30 + x, start);
      x += this.increment;
    }
    this.context.stroke();
    this.context.restore();
    // this.context.fill();
  }
}

