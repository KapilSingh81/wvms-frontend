import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { NgxPaginationModule } from 'ngx-pagination';
import { CreateDepartment } from '../create-department/create-department';
import { DepartmentService } from '../../services/department-service';
import { NotificationService } from '../../../../../shared/services/notification-service/notificaiton';
import { DeleteConfirnmation } from '../../../../../shared/components/delete-confirnmation/delete-confirnmation';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './department-list.html',
  styleUrl: './department-list.scss',
})
export class DepartmentList implements OnInit {
  private departmentService = inject(DepartmentService);
  private modalService = inject(BsModalService);
  private notification = inject(NotificationService);
  bsModalRef!: BsModalRef;

  isLoading = false;
  searchKeyword = '';

  allDepartments: any[] = [];
  departmentList: any[] = [];
  columns: any[] = [];

  pagesize = {
    limit: 25,
    offset: 1,
    count: 0,
  };

  get startValue(): number {
    return this.pagesize.count > 0
      ? (this.pagesize.offset - 1) * this.pagesize.limit + 1
      : 0;
  }

  get lastValue(): number {
    return Math.min(
      this.pagesize.offset * this.pagesize.limit,
      this.pagesize.count
    );
  }

  ngOnInit(): void {
    this.setInitialValue();
    this.getDepartmentList();
  }

  setInitialValue(): void {
    this.columns = [
      { key: 'sno', title: 'S.No.' },
      { key: 'name', title: 'Department Name' },
      { key: 'status', title: 'Status' },
      { key: 'action', title: 'Action' },
    ];
  }

  getDepartmentList(): void {
    this.isLoading = true;
    this.departmentService.departmentList().subscribe((res: any) => {
      console.log('Department List Response:', res);
      this.isLoading = false;
      const body = res?.body ?? res;
      if (body?.success === true) {
        this.allDepartments = body?.data ?? [];
        this.applyFilterAndPagination();
      } else {
        this.allDepartments = [];
        this.departmentList = [];
        this.pagesize.count = 0;
        this.notification.error(body?.message || 'Failed to load departments');
      }
    });
  }

  private applyFilterAndPagination(): void {
    const keyword = this.searchKeyword.trim().toLowerCase();
    const filtered = keyword
      ? this.allDepartments.filter((item: any) =>
        item?.name?.toLowerCase().includes(keyword)
      )
      : this.allDepartments;
    this.pagesize.count = filtered.length;
    const maxPage = Math.ceil(filtered.length / this.pagesize.limit) || 1;
    if (this.pagesize.offset > maxPage) {
      this.pagesize.offset = 1;
    }
    const start = (this.pagesize.offset - 1) * this.pagesize.limit;
    const end = start + this.pagesize.limit;
    this.departmentList = filtered.slice(start, end);
  }

  onAddDepartment(value: any): void {
    const initialState: ModalOptions = {
      initialState: {
        editData: value ? value : '',
      },
    };

    this.bsModalRef = this.modalService.show(
      CreateDepartment,
      Object.assign(initialState, {
        class: 'modal-md modal-dialog-centered alert-popup',
      })
    );

    this.bsModalRef?.content?.mapdata?.subscribe(() => {
      this.pagesize.offset = 1;
      this.searchKeyword = '';
      this.getDepartmentList();
    });
  }

  onDeleteDepartment(item: any): void {
    const payload = { id: item?.id };
    const url = this.departmentService.deleteDepartment(payload);
    const initialState: ModalOptions = {
      initialState: {
        title: `Department : ${item?.name}`,
        content: 'Are you sure you want to delete?',
        primaryActionLabel: 'Delete',
        secondaryActionLabel: 'Cancel',
        service: url,
      },
    };

    this.bsModalRef = this.modalService.show(
      DeleteConfirnmation,
      Object.assign(initialState, {
        id: 'confirmation',
        class: 'modal-md modal-dialog-centered',
      })
    );

    this.bsModalRef?.content.mapdata.subscribe((value: any) => {
      const body = value?.body ?? value;
      if (body?.success === true) {
        this.notification.success(
          body?.message || body?.actionResponse || 'Deleted successfully'
        );
        this.pagesize.offset = 1;
        this.getDepartmentList();
      } else {
        this.notification.error(
          body?.message || body?.actionResponse || 'Delete failed'
        );
      }
    });
  }

  onTablePageChange(event: number): void {
    this.pagesize.offset = event;
    this.applyFilterAndPagination();
  }

  onPageSizeChange(event: Event): void {
    const selectedSize = parseInt(
      (event.target as HTMLSelectElement).value,
      10
    );
    this.pagesize.limit = selectedSize;
    this.pagesize.offset = 1;
    this.applyFilterAndPagination();
  }

  onSearch(event: any): void {
    const searchValue = event.target.value.trim().replace(/\s+/g, ' ');
    this.searchKeyword = searchValue;
    this.pagesize.offset = 1;
    this.applyFilterAndPagination();
  }

  clearSearch(): void {
    this.searchKeyword = '';
    this.pagesize.offset = 1;
    this.applyFilterAndPagination();
  }
}