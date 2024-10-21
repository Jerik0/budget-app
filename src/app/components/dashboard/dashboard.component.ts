import { Component, inject, OnInit } from '@angular/core';
import {BillService} from "../../services/bill.service";
import {MatButton} from "@angular/material/button";
import {Bill} from "../../models/Bill";
import Category from "../../enums/Category";
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
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {KeyValuePipe, NgClass, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatDialog} from "@angular/material/dialog";
import {MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";

@Component({
  selector: 'app-dashboard',
  standalone: true,
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
    MatFormField,
    MatInput,
    NgClass,
    MatIcon,
    MatIconModule,
    MatSelect,
    NgForOf,
    KeyValuePipe,
    MatOption,
    FormsModule,
    MatMenu,
    NgIf,
    MatMenuTrigger,
    MatMenuContent,
    MatMenuItem,
    NgTemplateOutlet
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  protected readonly parseInt = parseInt;
  protected readonly category = Category;
  date = new Date();
  billsToDelete: number[] = [];
  editableId: number | undefined;
  dataSource = new MatTableDataSource<any>();
  columnsToDisplay = ['name', 'amount', 'date', 'necessity', 'category'];
  billForm: FormGroup;
  readonly dialog = inject(MatDialog);

  constructor(private billService: BillService, public fb: FormBuilder) {
    this.billForm = this.fb.group({
      bills: this.fb.array([])
    });
  }

  ngOnInit(): void {
    console.log('============ BILLS LIST PAGE LOADED =============')
    this.getBillsList();
  }

  addBillToFormGroup(bill: any) {
    const billGroup = this.fb.group({
      id: new FormControl(bill.id, [Validators.required]),
      name: new FormControl(bill.name, [Validators.required]),
      amount: new FormControl(bill.amount, [Validators.required]),
      date: new FormControl(bill.date, [Validators.required]),
      necessity: new FormControl(bill.necessity, [Validators.required]),
      category: new FormControl(bill.category, [Validators.required]),
    });
    billGroup.disable();
    this.billsArray.push(billGroup);
  }

  get billsArray(): FormArray {
    return this.billForm.get('bills') as FormArray;
  }

  onAddBill() {
    let currentDate = this.date.toISOString();
    let bill = new Bill('test name', '$10.00', currentDate, true, Category.General);

    this.billService.createBill(bill).subscribe(res => {
      // copy data, update it, assign back to dataSource.data
      let updatedData = this.dataSource.data;

      updatedData.push(res);

      this.dataSource.data = updatedData;

      console.log('bill created:', res);

      this.updateBillFormGroup();
    });
  }

  getBillsList() {
    this.billService.getAllBills().subscribe(res => {
      // @ts-ignore
      this.dataSource.data = res;

      this.updateBillFormGroup();
    })
  }

  onSelectBill(id: number) {
    let arrayToFilter = this.billsToDelete;
    if (this.billsToDelete.includes(id)) {
      this.billsToDelete = arrayToFilter.filter(item => item !== id);
    } else {
      this.billsToDelete.push(id);
    }
    console.log('bills to delete:', this.billsToDelete);
  }

  deleteSelectedBills(id?: number) {
    console.log('bills to delete:', this.billsToDelete);
    if (id) {
      this.billsToDelete.push(id);
    }

    if (this.billsToDelete.length !== 0) {
      this.billService.delete(this.billsToDelete).subscribe(res => {
        this.billsToDelete = [];
        this.getBillsList();
      });
    }
  }

  // menu
  handleUpdateBill(id: number, billIndex: number, update: boolean) {
    let updatedBill = this.billsArray.controls[billIndex].value;

    this.billService.getBillById(id).subscribe(originalBill => {
      // compare incoming bill to the bill from the database
      if (JSON.stringify(originalBill) !== JSON.stringify(updatedBill) && update) {

        // update bill if they are not the same, and if user wants to update
        this.billService.updateBill(id, updatedBill).subscribe(res => {
          console.log('bill updated with new values:', updatedBill);
          this.getBillsList();
        })
      }
    });

    // if clicking the delete button, don't make row editable
    if(this.getIcon('right', id) === 'delete' && !update) return;

    this.toggleEditable(id, billIndex);
  }

  toggleEditable(id: number, billIndex: number) {
    if (id !== this.editableId)  {
      this.editableId = id;
      this.billsArray.controls[billIndex].enable();
    } else {
      this.editableId = undefined;
      this.billsArray.controls[billIndex].disable();
    }
  }

  isDisabled(id: number): boolean {
    return this.editableId !== id;
  }

  getIcon(side: string, id: number) {
    let icon = '';
    if (side === 'left') {
      if (id === this.editableId) {
        icon = 'check'
      } else {
        icon = 'edit'
      }
    }

    if (side === 'right') {
      if (id === this.editableId) {
        icon = 'close'
      } else {
        icon = 'delete'
      }
    }
    return icon;
  }

  seeFormGroup() {
    console.log(this.billForm);
  }

  updateBillFormGroup() {
    this.billsArray.clear();

    this.dataSource.data.forEach(bill => {
      this.addBillToFormGroup(bill);
    })
  }
}
