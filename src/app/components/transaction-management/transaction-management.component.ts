import {Component, HostListener, inject, OnInit} from '@angular/core';
import {TransactionService} from "../../services/transaction.service";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {Transaction} from "../../models/Transaction";
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
import {CreateTransactionDialogComponent} from "../dialogs/create-transaction-dialog/create-transaction-dialog.component";
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
  selector: 'app-transaction-management',
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
  templateUrl: './transaction-management.component.html',
  styleUrl: './transaction-management.component.scss'
})
export class TransactionManagementComponent implements OnInit {
  protected readonly parseInt = parseInt;
  protected readonly category = Category;
  protected readonly frequency = Frequency;
  protected readonly chargeType = ChargeType;
  readonly dialog = inject(MatDialog);

  date = new Date();
  transactionsToDelete: number[] = [];
  editableId: number | undefined;
  dataSource = new MatTableDataSource<any>();
  columnsToDisplay = ['select', 'name', 'amount', 'date', 'frequency', 'necessity', 'category', 'chargeType'];
  transactionForm: FormGroup;
  selection = new SelectionModel<any>(true, []);

  get transactionsArray(): FormArray {
    return this.transactionForm.get('transactions') as FormArray;
  }

  constructor(private transactionService: TransactionService, public fb: FormBuilder) {
    this.transactionForm = this.fb.group({
      transactions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    console.log('============ BILLS LIST PAGE LOADED =============')
    this.getTransactionsList();
  }

  getTransactionsList() {
    this.transactionService.getAllTransactions().subscribe(res => {
      // @ts-ignore
      this.dataSource.data = res;
      this.updateTransactionFormGroup();
    })
  }

  // ===== SELECTION LOGIC =====
  onSelectTransaction(row: any) {
    this.selection.toggle(row);
    let arrayToFilter = this.transactionsToDelete;
    if (this.transactionsToDelete.includes(row.id)) {
      this.transactionsToDelete = arrayToFilter.filter(item => item !== row.id);
    } else {
      this.transactionsToDelete.push(row.id);
    }
    console.log('transactions to delete:', this.transactionsToDelete);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.transactionsToDelete = [];
      this.selection.clear();
      return;
    }

    this.dataSource.data.map(transaction => {
      if (!this.transactionsToDelete.includes(transaction.id)) {
        this.transactionsToDelete.push(transaction.id);
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

  deleteSelectedTransactions(id?: number) {
    if (id) {
      this.transactionsToDelete.push(id);
    }

    if (this.transactionsToDelete.length !== 0) {
      this.transactionService.delete(this.transactionsToDelete).subscribe(() => {
        this.transactionsToDelete = [];
        this.selection.clear();
        this.getTransactionsList();
      });
    }
  }

  // ===== ADD / UPDATE LOGIC =====
  openAddTransactionDialog() {
    let createTransactionDialog = this.dialog.open(CreateTransactionDialogComponent, {
      height: '300px',
      width: '900px'
    });

    createTransactionDialog.afterClosed().subscribe((transaction: Transaction) => {
      // console.log(transaction);
      if (this.transactionService.isValid(transaction)) {
        this.onAddTransaction(transaction);
      }
    })
  }

  onAddTransaction(transaction: Transaction) {
    this.editableId = undefined;

    this.transactionService.createTransaction(transaction).subscribe((res) => {
      console.log(res);
      this.selection.clear();
      this.transactionsToDelete = [];
      this.getTransactionsList();
    });
  }

  handleTransactionEdit(updatedTransactionForm: any, update: boolean) {
    // reset previously enabled row if it's not the current one.
    if (this.getEnabledTransaction() && this.editableId !== updatedTransactionForm.value.id) {
      this.editableId = undefined;
      this.resetTransactionFormValues(this.getEnabledTransaction());
      // @ts-ignore
      this.getEnabledTransaction().disable();
    }

    // if not updating we can just reset everything and exit.
    if (!update) {
      let transactionToReset = this.getEnabledTransaction() ? this.getEnabledTransaction() : updatedTransactionForm;
      this.resetTransactionFormValues(transactionToReset);
      // @ts-ignore
      transactionToReset.disable();
      this.editableId = undefined;
      return;
    }

    this.toggleTransactionEnabled(updatedTransactionForm);
    this.handleUpdateTransaction(updatedTransactionForm, update);
  }

  // menu
  handleUpdateTransaction(transactionForm: any, update: boolean) {

    if(!update) return;

    // @ts-ignore
    let updatedTransaction = transactionForm.value;

    this.transactionService.getTransactionById(updatedTransaction.id).subscribe((originalTransaction: any) => {
      // console.log(JSON.stringify(originalTransaction));
      // console.log(JSON.stringify(updatedTransaction));

      // compare incoming transaction to the transaction from the database
      if (JSON.stringify(originalTransaction) !== JSON.stringify(updatedTransaction)) {
        // update transaction if they are not the same, and if user wants to update
        this.transactionService.updateTransaction(updatedTransaction).subscribe(() => {
          console.log('transaction updated with new values:', updatedTransaction);
          this.getTransactionsList();
          transactionForm.disable();
          this.editableId = undefined;
          this.transactionsToDelete = [];
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
        // this.getEnabledTransaction();
        this.resetTransactionFormValues();
        this.toggleTransactionEnabled(this.getEnabledTransaction());
      }
    }

    if (event.key === 'Enter') {
      if (this.editableId !== undefined) {
        this.handleTransactionEdit(this.getEnabledTransaction(), true);
      }
    }

  }

  updateTransactionFormGroup() {
    this.transactionsArray.clear();

    this.dataSource.data.forEach(transaction => {
      this.addTransactionToFormGroup(transaction);
    })
  }

  addTransactionToFormGroup(transaction: any) {
    console.log(transaction);
    const transactionGroup = this.fb.group({
      id: new FormControl(transaction.id, [Validators.required]),
      name: new FormControl(transaction.name, [Validators.required]),
      amount: new FormControl(transaction.amount, [Validators.required]),
      date: new FormControl(transaction.date, [Validators.required]),
      necessity: new FormControl(transaction.necessity, [Validators.required]),
      category: new FormControl(transaction.category, [Validators.required]),
      frequency: new FormControl(transaction.frequency, [Validators.required]),
      chargeType: new FormControl(transaction.charge_type, [Validators.required])
    });
    transactionGroup.disable();
    this.transactionsArray.push(transactionGroup);

    console.log(this.transactionsArray);
  }

  resetTransactionFormValues(transactionForm?: any) {
    transactionForm = this.getEnabledTransaction() === undefined ? transactionForm : this.getEnabledTransaction();
    // @ts-ignore
    let updatedTransaction = transactionForm.value;

    this.transactionService.getTransactionById(updatedTransaction.id).subscribe(transaction => {
      // @ts-ignore
      return transactionForm.patchValue(transaction);
    })
  }

  getEnabledTransaction() {
    let activeTransaction;
    this.transactionsArray.controls.map((a: any, index) => {
      if (a.enabled) {
        activeTransaction = a;
      }
    });

    return activeTransaction;
  }

  toggleTransactionEnabled(transactionForm: any) {
    if (this.editableId === transactionForm.value.id) {
      this.editableId = undefined;
    } else {
      this.editableId = transactionForm.value.id;
    }

    if (transactionForm.enabled) {
      transactionForm.disable();
    } else {
      transactionForm.enable();
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
