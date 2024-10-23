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
import {SelectionModel} from "@angular/cdk/collections";
import {MatCheckbox} from "@angular/material/checkbox";
import {CreateBillDialogComponent} from "../dialogs/create-bill-dialog/create-bill-dialog.component";

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
    NgTemplateOutlet,
    MatCheckbox
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
  columnsToDisplay = ['select',  'name', 'amount', 'date', 'necessity', 'category'];
  billForm: FormGroup;
  selection = new SelectionModel<any>(true, []);
  readonly dialog = inject(MatDialog);
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
      height: '200px',
      width: '900px'
    });

    createBillDialog.afterClosed().subscribe(res => {
      if (res !== false) {
        this.onAddBill(res);
      }
    })
  }

  onAddBill(bill: Bill) {
    this.editableId = undefined;

    // let bill = new Bill('test name', '$10.00', currentDate, true, Category.General);

    this.billService.createBill(bill).subscribe(res => {
      this.selection.clear();
      this.billsToDelete = [];
      this.getBillsList();
    });
  }

  handleBillEdit(updatedBillForm: any, update: boolean) {
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
