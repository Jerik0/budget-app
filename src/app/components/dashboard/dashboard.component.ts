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
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('graph') graph!: ElementRef<HTMLCanvasElement>;
  private canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;
  graphHeight: number = 400;
  graphWidth: number = 800;
  private bills: any;
  maximum: any;

  constructor(private billService: BillService) {

  }

  ngOnInit(): void {
    console.log('============ DASHBOARD LOADED =============');
    this.getData();
  }

  ngAfterViewInit() {
    this.canvas = this.graph.nativeElement;
    this.context = this.canvas.getContext('2d')!;
    console.log(this.graph);

    this.drawSomething();
  }

  getData() {
    this.billService.getAllBills().subscribe(res => {
      this.bills = res;
      console.log(this.bills);
      this.maximum = this.bills.reduce((acc: any, item: any) => (acc.amount > item.amount ? acc.amount : item.amount), 0);
      console.log(this.maximum);
      this.mapData();
    })
  }

  drawSomething() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = 'rgba(0,0,0,0.2)';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  mapData() {
    this.context.beginPath();

    this.bills.map((bill: any, i: number) => {
      //
      let lastX = Math.floor(this.canvas.width / this.bills.length) * i;
      let lastY = this.canvas.height - Math.floor((bill.amount / this.maximum) * (this.canvas.height - 10));
      console.log('lastX:', lastX);
      console.log('lastY:', lastY);

      this.context.lineTo(lastX, lastY);
      this.context.strokeStyle="#87fdd3";
      this.context.fillStyle="#edf5f3";
      this.context.fillText(bill.amount, lastX + 15, lastY + 2);
      this.context.stroke();
    })
  }
}
