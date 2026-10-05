import { Component, inject, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { NgxPaginationModule } from 'ngx-pagination';

import { CreateDesignation } from '../create-designation/create-designation';
import { DeleteConfirnmation } from '../../../../../shared/components/delete-confirnmation/delete-confirnmation';
import { DesignationService } from '../../services/designation-service';
import { NotificationService } from '../../../../../shared/services/notification-service/notificaiton';

@Component({
  selector: 'app-designation-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './designation-list.html',
  styleUrl: './designation-list.scss',
})
export class DesignationList implements OnInit {
  private designationService = inject(DesignationService);
  private modalService = inject(BsModalService);
  private notification = inject(NotificationService);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  bsModalRef!: BsModalRef;
  isLoading = false;
  searchKeyword = '';

  allDesignations: any[] = [];
  designationList: any[] = [];
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
    this.getDesignationList();
  }

  setInitialValue(): void {
    this.columns = [
      { key: 'sno', title: 'S.No.' },
      { key: 'name', title: 'Designation Name' },
      { key: 'status', title: 'Status' },
      { key: 'action', title: 'Action' },
    ];
  }

  getDesignationList(): void {
    this.isLoading = true;
    this.designationService.designationList().subscribe((res: any) => {
      this.ngZone.run(() => {
        this.isLoading = false;
        const body = res?.body ?? res;
        if (body?.success === true) {
          this.allDesignations = body?.data ?? [];
          this.applyFilterAndPagination();
        } else {
          this.allDesignations = [];
          this.designationList = [];
          this.pagesize.count = 0;
          this.notification.error(
            body?.message || 'Failed to load designations'
          );
        }
        this.cdr.detectChanges();
      });
    });
  }

  private applyFilterAndPagination(): void {
    const keyword = this.searchKeyword.trim().toLowerCase();
    const filtered = keyword
      ? this.allDesignations.filter((item: any) =>
        item?.name?.toLowerCase().includes(keyword)
      )
      : this.allDesignations;
    this.designationList = filtered;
    this.pagesize.count = filtered.length;
    const maxPage = Math.ceil(filtered.length / this.pagesize.limit) || 1;
    if (this.pagesize.offset > maxPage) {
      this.pagesize.offset = 1;
    }
  }

  onAddDesignation(value: any): void {
    const initialState: ModalOptions = {
      initialState: {
        editData: value ? value : '',
      },
    };
    this.bsModalRef = this.modalService.show(
      CreateDesignation,
      Object.assign(initialState, {
        class: 'modal-md modal-dialog-centered alert-popup',
      })
    );

    this.bsModalRef?.content?.mapdata?.subscribe(() => {
      this.pagesize.offset = 1;
      this.searchKeyword = '';
      this.getDesignationList();
    });
  }

  onDeleteDesignation(item: any): void {
    const payload = { id: item?.id };
    const url = this.designationService.deleteDesignation(payload);
    const initialState: ModalOptions = {
      initialState: {
        title: `Designation : ${item?.name}`,
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
        this.getDesignationList();
      } else {
        this.notification.error(
          body?.message || body?.actionResponse || 'Delete failed'
        );
      }
    });
  }

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