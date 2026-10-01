import { Component, inject, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { NgxPaginationModule } from 'ngx-pagination';

import { CreateEmployeeVisitor } from '../create-employee-visitor/create-employee-visitor';
import { DeleteConfirnmation } from '../../../../../shared/components/delete-confirnmation/delete-confirnmation';
import { EmployeeVisitorService } from '../../services/employee-visitor-service';
import { NotificationService } from '../../../../../shared/services/notification-service/notificaiton';
import { enviornment } from '../../../../../../../enviornment/enviornment';

@Component({
  selector: 'app-employee-visitor-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './employee-visitor-list.html',
  styleUrl: './employee-visitor-list.scss',
})
export class EmployeeVisitorList implements OnInit {
  private service = inject(EmployeeVisitorService);
  private modalService = inject(BsModalService);
  private notification = inject(NotificationService);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  bsModalRef!: BsModalRef;

  imageBaseUrl = enviornment.baseUrl;

  // ==================== DATA ====================
  isLoading = false;
  searchKeyword = '';

  allEmployees: any[] = [];
  employeeVisitorList: any[] = [];
  columns: any[] = [];

  pagesize = {
    limit: 25,
    offset: 1,
    count: 0,
  };

  // ==================== PAGINATION HELPERS ====================
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

  // ==================== LIFECYCLE ====================
  ngOnInit(): void {
    this.setInitialValue();
    this.getList();
  }

  setInitialValue(): void {
    this.columns = [
      { key: 'sno', title: 'S.No.' },
      { key: 'name', title: 'Name' },
      { key: 'email', title: 'Email' },
      { key: 'phone', title: 'Phone' },
      { key: 'department', title: 'Department' },
      { key: 'designation', title: 'Designation' },
      { key: 'status', title: 'Status' },
      { key: 'image', title: 'Photo' },
      { key: 'action', title: 'Action' },
    ];
  }

  // ==================== GET LIST ====================
  getList(): void {
    this.isLoading = true;

    this.service.employeeVisitorList().subscribe((res: any) => {
      console.log('Employee List Response:', res);

      this.ngZone.run(() => {
        this.isLoading = false;

        const body = res?.body ?? res;

        if (body?.success === true) {
          this.allEmployees = body?.data ?? [];
          this.applyFilterAndPagination();
        } else {
          this.allEmployees = [];
          this.employeeVisitorList = [];
          this.pagesize.count = 0;
          this.notification.error(body?.message || 'Failed to load employees');
        }

        this.cdr.detectChanges();
      });
    });
  }

  // ==================== FILTER + PAGINATION ====================
  private applyFilterAndPagination(): void {
    const keyword = this.searchKeyword.trim().toLowerCase();

    const filtered = keyword
      ? this.allEmployees.filter((item: any) => {
          const fullName =
            `${item?.first_name || ''} ${item?.last_name || ''}`.toLowerCase();
          return (
            fullName.includes(keyword) ||
            item?.email?.toLowerCase().includes(keyword) ||
            item?.phone?.toLowerCase().includes(keyword) ||
            item?.department?.name?.toLowerCase().includes(keyword) ||
            item?.designation?.name?.toLowerCase().includes(keyword)
          );
        })
      : this.allEmployees;

    this.employeeVisitorList = filtered;
    this.pagesize.count = filtered.length;

    const maxPage = Math.ceil(filtered.length / this.pagesize.limit) || 1;
    if (this.pagesize.offset > maxPage) {
      this.pagesize.offset = 1;
    }
  }

  // ==================== ADD / EDIT ====================
  onAdd(value: any): void {
    const initialState: ModalOptions = {
      initialState: {
        editData: value ? value : '',
      },
    };

    this.bsModalRef = this.modalService.show(
      CreateEmployeeVisitor,
      Object.assign(initialState, {
        class: 'modal-lg modal-dialog-centered alert-popup',
      })
    );

    this.bsModalRef?.content?.mapdata?.subscribe(() => {
      this.pagesize.offset = 1;
      this.searchKeyword = '';
      this.getList();
    });
  }

  // ==================== DELETE ====================
  onDelete(item: any): void {
    const payload = { id: item?.id };
    const url = this.service.deleteEmployeeVisitor(payload);

    const fullName =
      `${item?.first_name || ''} ${item?.last_name || ''}`.trim() || 'Employee';

    const initialState: ModalOptions = {
      initialState: {
        title: `Employee : ${fullName}`,
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

      if (value?.status === 200 || body?.success === true) {
        this.notification.success(
          body?.message || body?.actionResponse || 'Deleted successfully'
        );
        this.pagesize.offset = 1;
        this.getList();
      } else {
        this.notification.error(
          body?.message || body?.actionResponse || 'Delete failed'
        );
      }
    });
  }

  // ==================== PAGINATION ====================
  onTablePageChange(event: number): void {
    this.pagesize.offset = event;
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

  // ==================== SEARCH ====================
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

  // ==================== HELPERS ====================
  getFullName(item: any): string {
    const fn = item?.first_name || '';
    const ln = item?.last_name || '';
    return `${fn} ${ln}`.trim() || 'NA';
  }

  getImageUrl(item: any): string {
    const img = item?.image;
    if (!img) return '';

    // Full URL
    if (img.startsWith('http://') || img.startsWith('https://')) {
      return img;
    }

    // Relative path
    const cleanPath = img.startsWith('/') ? img.slice(1) : img;
    return `${this.imageBaseUrl}${cleanPath}`;
  }

  onImageError(event: any): void {
    // Hide broken image, no fallback
    event.target.style.display = 'none';
  }
}