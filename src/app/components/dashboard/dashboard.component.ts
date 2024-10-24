import {Component, HostListener, inject, OnInit} from '@angular/core';
import {BillService} from "../../services/bill.service";
import {MatButton, MatButtonModule} from "@angular/material/button";
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
    MatButtonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  protected readonly parseInt = parseInt;
  protected readonly category = Category;
  protected readonly frequency = Frequency;
  protected readonly chargeType = ChargeType;
  readonly dialog = inject(MatDialog);

  date = new Date();
  billsToDelete: number[] = [];
  editableId: number | undefined;
  dataSource = new MatTableDataSource<any>();
  columnsToDisplay = ['select', 'name', 'amount', 'date', 'frequency', 'necessity', 'category', 'chargeType'];
  billForm: FormGroup;
  selection = new SelectionModel<any>(true, []);

  get billsArray(): FormArray {
    return this.billForm.get('bills') as FormArray;
  }

  constructor(private billService: BillService, public fb: FormBuilder) {
    this.billForm = this.fb.group({
      bills: this.fb.array([])
    });
  }

  ngOnInit(): void {
    console.log('============ BILLS LIST PAGE LOADED =============')
    this.getBillsList();
  }

  getBillsList() {
    this.billService.getAllBills().subscribe(res => {
      // @ts-ignore
      this.dataSource.data = res;
      this.updateBillFormGroup();
    })
  }

  // ===== SELECTION LOGIC =====
  onSelectBill(row: any) {
    this.selection.toggle(row);
    let arrayToFilter = this.billsToDelete;
    if (this.billsToDelete.includes(row.id)) {
      this.billsToDelete = arrayToFilter.filter(item => item !== row.id);
    } else {
      this.billsToDelete.push(row.id);
    }
    console.log('bills to delete:', this.billsToDelete);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.billsToDelete = [];
      this.selection.clear();
      return;
    }

    this.dataSource.data.map(bill => {
      if (!this.billsToDelete.includes(bill.id)) {
        this.billsToDelete.push(bill.id);
      }
    })

    this.selection.select(...this.dataSource.data);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  deleteSelectedBills(id?: number) {
    if (id) {
      this.billsToDelete.push(id);
    }

    if (this.billsToDelete.length !== 0) {
      this.billService.delete(this.billsToDelete).subscribe(() => {
        this.billsToDelete = [];
        this.selection.clear();
        this.getBillsList();
      });
    }
  }

  // ===== ADD / UPDATE LOGIC =====
  openAddBillDialog() {
    let createBillDialog = this.dialog.open(CreateBillDialogComponent, {
      height: '300px',
      width: '900px'
    });

    createBillDialog.afterClosed().subscribe((bill: Bill) => {
      // console.log(bill);
      if (this.billService.isValid(bill)) {
        this.onAddBill(bill);
      }
    })
  }

  onAddBill(bill: Bill) {
    this.editableId = undefined;

    this.billService.createBill(bill).subscribe((res) => {
      console.log(res);
      this.selection.clear();
      this.billsToDelete = [];
      this.getBillsList();
    });
  }

  handleBillEdit(updatedBillForm: any, update: boolean) {
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

    this.billService.getBillById(updatedBill.id).subscribe((originalBill: any) => {
      // console.log(JSON.stringify(originalBill));
      // console.log(JSON.stringify(updatedBill));

      // compare incoming bill to the bill from the database
      if (JSON.stringify(originalBill) !== JSON.stringify(updatedBill)) {
        // update bill if they are not the same, and if user wants to update
        this.billService.updateBill(updatedBill).subscribe(() => {
          console.log('bill updated with new values:', updatedBill);
          this.getBillsList();
          billForm.disable();
          this.editableId = undefined;
          this.billsToDelete = [];
          this.selection.clear();
        })
      }
    });
  }

  // ===== HELPER FUNCTIONS =====
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {

    if (event.key === 'Escape') {
      if (this.editableId !== undefined) {
        // this.getEnabledBill();
        this.resetBillFormValues();
        this.toggleBillEnabled(this.getEnabledBill());
      }
    }

    if (event.key === 'Enter') {
      if (this.editableId !== undefined) {
        this.handleBillEdit(this.getEnabledBill(), true);
      }
    }

  }

  updateBillFormGroup() {
    this.billsArray.clear();

    this.dataSource.data.forEach(bill => {
      this.addBillToFormGroup(bill);
    })
  }

  addBillToFormGroup(bill: any) {
    console.log(bill);
    const billGroup = this.fb.group({
      id: new FormControl(bill.id, [Validators.required]),
      name: new FormControl(bill.name, [Validators.required]),
      amount: new FormControl(bill.amount, [Validators.required]),
      date: new FormControl(bill.date, [Validators.required]),
      necessity: new FormControl(bill.necessity, [Validators.required]),
      category: new FormControl(bill.category, [Validators.required]),
      frequency: new FormControl(bill.frequency, [Validators.required]),
      chargeType: new FormControl(bill.charge_type, [Validators.required])
    });
    billGroup.disable();
    this.billsArray.push(billGroup);

    console.log(this.billsArray);
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
}
