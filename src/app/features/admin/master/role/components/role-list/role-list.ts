import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { NgxPaginationModule } from 'ngx-pagination';

import { CreateRole } from '../create-role/create-role';
import { RoleService } from '../../services/role-service';
import { NotificationService } from '../../../../../shared/services/notification-service/notificaiton';
import { DeleteConfirnmation } from '../../../../../shared/components/delete-confirnmation/delete-confirnmation';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './role-list.html',
  styleUrl: './role-list.scss',
})
export class RoleList implements OnInit {
  private roleService = inject(RoleService);
  private modalService = inject(BsModalService);
  private notification = inject(NotificationService);

  bsModalRef!: BsModalRef;

  // ==================== DATA ====================
  isLoading = false;
  searchKeyword = '';

  allRoles: any[] = [];      // Master data
  roleList: any[] = [];      // UI filtered + paginated
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
    this.getRoleList();
  }

  setInitialValue(): void {
    this.columns = [
      { key: 'sno', title: 'S.No.' },
      { key: 'name', title: 'Role Name' },
      { key: 'status', title: 'Status' },
      { key: 'action', title: 'Action' },
    ];
  }

  // ==================== GET LIST ====================
  getRoleList(): void {
    this.isLoading = true;

    this.roleService.roleList().subscribe((res: any) => {
      console.log('Role List Response:', res);
      this.isLoading = false;

      const body = res?.body ?? res;

      if (body?.success === true) {
        this.allRoles = body?.data ?? [];
        this.applyFilterAndPagination();
      } else {
        this.allRoles = [];
        this.roleList = [];
        this.pagesize.count = 0;
        this.notification.error(body?.message || 'Failed to load roles');
      }
    });
  }

  // ==================== FILTER + PAGINATION (Frontend) ====================
  private applyFilterAndPagination(): void {
    const keyword = this.searchKeyword.trim().toLowerCase();
    const filtered = keyword
      ? this.allRoles.filter((item: any) =>
          item?.name?.toLowerCase().includes(keyword)
        )
      : this.allRoles;

    this.pagesize.count = filtered.length;

    const maxPage = Math.ceil(filtered.length / this.pagesize.limit) || 1;
    if (this.pagesize.offset > maxPage) {
      this.pagesize.offset = 1;
    }

    const start = (this.pagesize.offset - 1) * this.pagesize.limit;
    const end = start + this.pagesize.limit;

    this.roleList = filtered.slice(start, end);
  }

  // ==================== ADD / EDIT ====================
  onAddRole(value: any): void {
    const initialState: ModalOptions = {
      initialState: {
        editData: value ? value : '',
      },
    };

    this.bsModalRef = this.modalService.show(
      CreateRole,
      Object.assign(initialState, {
        class: 'modal-md modal-dialog-centered alert-popup',
      })
    );

    this.bsModalRef?.content?.mapdata?.subscribe(() => {
      this.pagesize.offset = 1;
      this.searchKeyword = '';
      this.getRoleList();
    });
  }

  onDeleteRole(item: any): void {
    const payload = { id: item?.id };
    const url = this.roleService.deleteRole(payload);

    const initialState: ModalOptions = {
      initialState: {
        title: `Role : ${item?.name}`,
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
        this.getRoleList();
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
}