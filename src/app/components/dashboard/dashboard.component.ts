import {Component, HostListener, inject, OnInit} from '@angular/core';
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

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {

    if (event.key === 'Escape') {
      if (this.editableId !== undefined) {
        // this.getEnabledBill();
        this.resetBillFormValues();
        this.toggleBillEnabled(this.getEnabledBill());
      }
    }

  }

  getEnabledBill() {
    let activeBill;
    this.billsArray.controls.map((a: any, index) => {
      if (a.enabled) {
        activeBill = a;
      }
    });

    return activeBill;
  }

  toggleBillEnabled(billForm: any) {
    if (this.editableId === billForm.value.id) {
      this.editableId = undefined;
    } else {
      this.editableId = billForm.value.id;
    }

    if (billForm.enabled) {
      billForm.disable();
    } else {
      billForm.enable();
    }
  }

  get billsArray(): FormArray {
    return this.billForm.get('bills') as FormArray;
  }

  onAddBill() {
    this.editableId = undefined;
    let currentDate = this.date.toISOString();
    let bill = new Bill('test name', '$10.00', currentDate, true, Category.General);

    this.billService.createBill(bill).subscribe(res => {
      this.getBillsList();
    });
  }

  getBillsList() {
    this.billService.getAllBills().subscribe(res => {
      // @ts-ignore
      this.dataSource.data = res;

      this.updateBillFormGroup();
    })
  }

  updateBillFormGroup() {
    this.billsArray.clear();

    console.log(this.billsArray);

    this.dataSource.data.forEach(bill => {
      this.addBillToFormGroup(bill);
    })
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
    if (id) {
      this.billsToDelete.push(id);
    }

    if (this.billsToDelete.length !== 0) {
      this.billService.delete(this.billsToDelete).subscribe(() => {
        this.billsToDelete = [];
        this.getBillsList();
      });
    }
  }

  handleBillEdit(updatedBillForm: any, update: boolean, index: number) {
    console.log('=== handleBillEdit called ===')
    console.log('is a bill enabled AND it isnt this bill?: ', this.getEnabledBill() && this.editableId !== updatedBillForm.value.id);
    console.log('are updating:', !update);
    console.log('updatedBillForm.value.id:', updatedBillForm.value.id);


    // reset previously enabled row if it's not the current one.
    if (this.getEnabledBill() && this.editableId !== updatedBillForm.value.id) {
      this.editableId = undefined;
      this.resetBillFormValues(this.getEnabledBill());
      // @ts-ignore
      this.getEnabledBill().disable();
    }

    // if not updating we can just reset everything and exit.
    if (!update) {
      let billToReset = this.getEnabledBill() ? this.getEnabledBill() : updatedBillForm;
      this.resetBillFormValues(billToReset);
      // @ts-ignore
      billToReset.disable();
      this.editableId = undefined;
      return;
    }

    this.toggleBillEnabled(updatedBillForm);
    this.handleUpdateBill(updatedBillForm, update);
  }

  // menu
  handleUpdateBill(billForm: any, update: boolean) {

    if(!update) return;

    // @ts-ignore
    let updatedBill = billForm.value;

    this.billService.getBillById(updatedBill.id).subscribe(originalBill => {
      // compare incoming bill to the bill from the database
      if (JSON.stringify(originalBill) !== JSON.stringify(updatedBill)) {
        // update bill if they are not the same, and if user wants to update
        this.billService.updateBill(updatedBill).subscribe(() => {
          console.log('bill updated with new values:', updatedBill);
          this.getBillsList();

          // this.resetBillFormValues();
          billForm.disable();
          this.editableId = undefined;
        })
      }
    });
  }

  resetBillFormValues(billForm?: any) {
    billForm = this.getEnabledBill() === undefined ? billForm : this.getEnabledBill();
    // @ts-ignore
    let updatedBill = billForm.value;

    this.billService.getBillById(updatedBill.id).subscribe(bill => {
      // @ts-ignore
      return billForm.patchValue(bill);
    })
  }

  isDisabled(id: number): boolean {
    return this.editableId !== id;
  }

  getIcon(side: string, id?: number) {
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

}
