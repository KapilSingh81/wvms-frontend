import { Component, inject, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { DashboardService } from '../../services/dashboard-service';
import { EmployeeVisitorService } from '../../../master/employee-visitor/services/employee-visitor-service';
import { NotificationService } from '../../../../shared/services/notification-service/notificaiton';
import { DeleteConfirnmation } from '../../../../shared/components/delete-confirnmation/delete-confirnmation';
import { VisitorService } from '../../../master/visitor/services/visitor-service';
import { VisitorDetail } from '../../components/visitor-detail/visitor-detail';
import * as XLSX from 'xlsx';

interface Summary {
  total_employees: number;
  total_visitors: number;
  checked_in: number;
  checked_out: number;
  still_inside: number;
}

interface CardItem {
  key: string;
  title: string;
  value: number;
  icon: string;
  color: string;
  type: string;
}

interface ColumnDef {
  key: string;
  title: string;
}

@Component({
  selector: 'app-manage-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './manage-dashboard.html',
  styleUrl: './manage-dashboard.scss',
})
export class ManageDashboard implements OnInit {
  private dashboardService = inject(DashboardService);
  private employeeService = inject(EmployeeVisitorService);
  private visitorService = inject(VisitorService);
  private notification = inject(NotificationService);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private modalService = inject(BsModalService);

  bsModalRef!: BsModalRef;
  fromDate: string = '';
  toDate: string = '';
  selectedType: string = 'total';
  isFiltering = false;
  isEmployeeView = false;
  hasStillInsideVisitor = false;
  isExporting = false;
  summary: Summary = {
    total_employees: 0,
    total_visitors: 0,
    checked_in: 0,
    checked_out: 0,
    still_inside: 0,
  };

  cards: CardItem[] = [
    {
      key: 'total_visitors',
      title: 'Total Visitors',
      value: 0,
      icon: 'fa-users',
      color: '#696cff',
      type: 'total',
    },
    {
      key: 'checked_in',
      title: 'Checked In',
      value: 0,
      icon: 'fa-sign-in-alt',
      color: '#10b981',
      type: 'checked_in',
    },
    {
      key: 'checked_out',
      title: 'Checked Out',
      value: 0,
      icon: 'fa-sign-out-alt',
      color: '#f59e0b',
      type: 'checked_out',
    },
    {
      key: 'still_inside',
      title: 'Still Inside',
      value: 0,
      icon: 'fa-building',
      color: '#3b82f6',
      type: 'still_inside',
    },
    {
      key: 'total_employees',
      title: 'Total Employees',
      value: 0,
      icon: 'fa-user-tie',
      color: '#8b5cf6',
      type: 'employees',
    },
  ];

  isLoading = false;
  searchKeyword = '';
  allVisitors: any[] = [];
  visitorList: any[] = [];
  columns: ColumnDef[] = [];
  pagesize = {
    limit: 25,
    offset: 1,
    count: 0,
  };

  private getVisitorColumns(): ColumnDef[] {
    return [
      { key: 'sno', title: 'S.No.' },
      { key: 'name', title: 'Visitor Name' },
      { key: 'aadhaar', title: 'Aadhaar' },
      { key: 'mobile', title: 'Mobile' },
      { key: 'host', title: 'Person to Meet' },
      { key: 'purpose', title: 'Purpose' },
      { key: 'check_in', title: 'Check In' },
      { key: 'checked_in_by', title: 'Checked In By' },
      { key: 'check_out', title: 'Check Out' },
      { key: 'checked_out_by', title: 'Checked Out By' },
      { key: 'status', title: 'Status' },
      { key: 'photo', title: 'Photo' },
      { key: 'action', title: 'Action' },
    ];
  }

  private employeeColumns: ColumnDef[] = [
    { key: 'sno', title: 'S.No.' },
    { key: 'name', title: 'Employee' },
    { key: 'email', title: 'Email' },
    { key: 'phone', title: 'Phone' },
    { key: 'department', title: 'Department' },
    { key: 'designation', title: 'Designation' },
    { key: 'photo', title: 'Photo' },
    { key: 'status', title: 'Status' },
  ];

  get startValue(): number {
    return this.pagesize.count > 0 ? (this.pagesize.offset - 1) * this.pagesize.limit + 1 : 0;
  }

  get lastValue(): number {
    return Math.min(this.pagesize.offset * this.pagesize.limit, this.pagesize.count);
  }

  ngOnInit(): void {
    this.setDefaultDates();
    this.loadDashboard();
  }

  setDefaultDates(): void {
    const now = new Date();
    const from = new Date(now);
    from.setHours(0, 0, 0, 0);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const fmt = (d: Date) =>
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    this.fromDate = fmt(from);
    this.toDate = fmt(now);
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.isEmployeeView = false;
    this.dashboardService.getDashboardData(this.fromDate, this.toDate, this.selectedType).subscribe((res: any) => {
      this.ngZone.run(() => {
        this.isLoading = false;
        this.isFiltering = false;
        const body = res?.body ?? res;
        if (body?.success === true) {
          const data = body?.data ?? {};
          this.summary = data?.summary ?? this.summary;
          this.updateCards();
          this.allVisitors = data?.visitors ?? [];
          this.hasStillInsideVisitor = this.allVisitors.some((v: any) => this.isStillInside(v));
          this.columns = this.getVisitorColumns();
          this.applyFilterAndPagination();
        } else {
          this.allVisitors = [];
          this.visitorList = [];
          this.pagesize.count = 0;
          this.hasStillInsideVisitor = false;
          this.columns = this.getVisitorColumns();
          this.notification.error(body?.message || 'Failed to load dashboard');
        }
        this.cdr.detectChanges();
      });
    });
  }

  // ==================== LOAD EMPLOYEES ====================
  loadEmployees(): void {
    this.isLoading = true;
    this.isEmployeeView = true;
    this.hasStillInsideVisitor = false;
    this.columns = [...this.employeeColumns];
    this.employeeService.employeeVisitorList().subscribe((res: any) => {
      this.ngZone.run(() => {
        this.isLoading = false;
        this.isFiltering = false;
        const body = res?.body ?? res;
        if (body?.success === true) {
          this.allVisitors = body?.data ?? [];
          this.applyFilterAndPagination();
        } else {
          this.allVisitors = [];
          this.visitorList = [];
          this.pagesize.count = 0;
          this.notification.error(body?.message || 'Failed to load employees');
        }
        this.cdr.detectChanges();
      });
    });
  }

  private updateCards(): void {
    this.cards = this.cards.map((card) => {
      const value = (this.summary as any)[card.key] ?? 0;
      return { ...card, value };
    });
  }

  onCardClick(card: CardItem): void {
    this.pagesize.offset = 1;
    this.searchKeyword = '';

    if (card.type === 'employees') {
      this.selectedType = 'employees';
      this.loadEmployees();
      return;
    }

    this.selectedType = card.type;
    this.loadDashboard();
  }

  isCardActive(card: CardItem): boolean {
    return this.selectedType === card.type;
  }

  onShowClick(): void {
    if (!this.fromDate || !this.toDate) {
      this.notification.warning('Please select From and To dates');
      return;
    }

    if (new Date(this.fromDate) > new Date(this.toDate)) {
      this.notification.warning('From date must be before To date');
      return;
    }

    this.isFiltering = true;
    this.pagesize.offset = 1;
    if (this.isEmployeeView) {
      this.loadEmployees();
    } else {
      this.loadDashboard();
    }
  }

  onResetFilter(): void {
    this.setDefaultDates();
    this.selectedType = 'total';
    this.searchKeyword = '';
    this.pagesize.offset = 1;
    this.loadDashboard();
  }

  private applyFilterAndPagination(): void {
    const keyword = this.searchKeyword.trim().toLowerCase();
    const filtered = keyword
      ? this.allVisitors.filter((item: any) => {
        const fullName = this.getFullName(item).toLowerCase();
        const hostName = this.getHostName(item).toLowerCase();
        return (
          fullName.includes(keyword) ||
          hostName.includes(keyword) ||
          item?.email?.toLowerCase().includes(keyword) ||
          item?.phone?.toLowerCase().includes(keyword) ||
          item?.national_id_no?.toLowerCase().includes(keyword) ||
          item?.company_name?.toLowerCase().includes(keyword) ||
          item?.purpose?.toLowerCase().includes(keyword)
        );
      })
      : this.allVisitors;
    this.pagesize.count = filtered.length;

    const maxPage = Math.ceil(filtered.length / this.pagesize.limit) || 1;
    if (this.pagesize.offset > maxPage) {
      this.pagesize.offset = 1;
    }
    this.hasStillInsideVisitor = !this.isEmployeeView && filtered.some((item: any) => this.isStillInside(item));

    if (!this.isEmployeeView) {
      this.columns = this.getVisitorColumns();
    }
    const start = (this.pagesize.offset - 1) * this.pagesize.limit;
    const end = start + this.pagesize.limit;
    this.visitorList = filtered.slice(start, end);
  }

  onTablePageChange(event: number): void {
    this.pagesize.offset = event;
    this.applyFilterAndPagination();
  }

  onPageSizeChange(event: Event): void {
    const size = parseInt((event.target as HTMLSelectElement).value, 10);
    this.pagesize.limit = size;
    this.pagesize.offset = 1;
    this.applyFilterAndPagination();
  }

  onSearch(event: any): void {
    const value = event.target.value.trim().replace(/\s+/g, ' ');
    this.searchKeyword = value;
    this.pagesize.offset = 1;
    this.applyFilterAndPagination();
  }

  clearSearch(): void {
    this.searchKeyword = '';
    this.pagesize.offset = 1;
    this.applyFilterAndPagination();
  }

  onViewDetails(item: any): void {
    const initialState = {
      visitor: item,
    };

    this.bsModalRef = this.modalService.show(VisitorDetail, {
      initialState,
      class: 'modal-lg modal-dialog-centered',
    });
  }

  onCheckout(item: any): void {
    const url = this.visitorService.checkoutVisitor({ id: item?.id });
    const initialState: ModalOptions = {
      initialState: {
        title: `Checkout Visitor : ${this.getFullName(item)}`,
        content: 'Are you sure you want to check out this visitor?',
        primaryActionLabel: 'Checkout',
        secondaryActionLabel: 'Cancel',
        service: url,
      },
    };

    this.bsModalRef = this.modalService.show(
      DeleteConfirnmation,
      Object.assign(initialState, {
        id: 'confirmation',
        class: 'modal-md modal-dialog-centered',
      }),
    );

    this.bsModalRef?.content?.mapdata?.subscribe((value: any) => {
      const body = value?.body ?? value;
      if (value?.status === 200 || body?.success === true) {
        this.notification.success(body?.message || body?.actionResponse || 'Visitor checked out');
        this.loadDashboard();
      } else {
        this.notification.error(body?.message || body?.actionResponse || 'Checkout failed');
      }
    });
  }

  isStillInside(item: any): boolean {
    const status = String(item?.visit_status || '')
      .trim()
      .toUpperCase();
    return status === 'STILL_INSIDE' || status === 'CHECKED_IN';
  }

  getFullName(item: any): string {
    const fn = item?.first_name || '';
    const ln = item?.last_name || '';
    return `${fn} ${ln}`.trim() || item?.name || 'NA';
  }

  getHostName(item: any): string {
    if (item?.employee) {
      const fn = item.employee?.first_name || '';
      const ln = item.employee?.last_name || '';
      const name = `${fn} ${ln}`.trim();
      return name || 'NA';
    }
    return item?.person_to_meet || item?.host_name || 'NA';
  }

  hasImage(item: any): boolean {
    return !!item?.image;
  }

  getImageUrl(item: any): string {
    const img = item?.image;
    if (!img) return '';

    if (img.startsWith('http://') || img.startsWith('https://')) {
      return img;
    }
    const cleanPath = img.startsWith('/') ? img.slice(1) : img;
    return `http://89.116.34.155:4000/${cleanPath}`;
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
  }

  formatTime(dt: string): string {
    if (!dt) return 'NA';
    try {
      const d = new Date(dt);
      return d.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return 'NA';
    }
  }

  getStatusBadge(status: any): string {
    if (typeof status === 'boolean') {
      return status ? 'bg-success text-white' : 'bg-danger text-white';
    }
    switch (status?.toUpperCase()) {
      case 'CHECKED_IN':
      case 'STILL_INSIDE':
        return 'bg-primary text-white';
      case 'CHECKED_OUT':
        return 'bg-warning text-white';
      default:
        return 'bg-secondary text-white';
    }
  }

  getStatusLabel(status: any): string {
    if (typeof status === 'boolean') {
      return status ? 'Active' : 'InActive';
    }
    switch (status?.toUpperCase()) {
      case 'CHECKED_IN':
        return 'Checked In';
      case 'CHECKED_OUT':
        return 'Checked Out';
      case 'STILL_INSIDE':
        return 'Still Inside';
      default:
        return status || 'NA';
    }
  }

  exportToExcel(): void {
    try {
      this.isExporting = true;
      const keyword = this.searchKeyword.trim().toLowerCase();
      const dataToExport = keyword
        ? this.allVisitors.filter((item: any) => {
          const fullName = this.getFullName(item).toLowerCase();
          const hostName = this.getHostName(item).toLowerCase();
          return (
            fullName.includes(keyword) ||
            hostName.includes(keyword) ||
            item?.email?.toLowerCase().includes(keyword) ||
            item?.phone?.toLowerCase().includes(keyword) ||
            item?.national_id_no?.toLowerCase().includes(keyword) ||
            item?.company_name?.toLowerCase().includes(keyword) ||
            item?.purpose?.toLowerCase().includes(keyword)
          );
        })
        : this.allVisitors;

      if (!dataToExport || dataToExport.length === 0) {
        this.notification.warning('Koi data available nahi hai export ke liye');
        this.isExporting = false;
        return;
      }

      const rows: any[] = dataToExport.map((item: any, index: number) => {
        if (this.isEmployeeView) {
          return {
            'S.No.': index + 1,
            'Employee Name': this.getFullName(item),
            Email: item?.email || 'NA',
            Phone: item?.phone || 'NA',
            Department: item?.department?.name || 'NA',
            Designation: item?.designation?.name || 'NA',
            Status: this.getStatusLabel(item?.status),
          };
        } else {
          return {
            'S.No.': index + 1,
            'Visitor Name': this.getFullName(item),
            Aadhaar: item?.national_id_no || 'NA',
            Mobile: item?.phone || 'NA',
            'Person to Meet': this.getHostName(item),
            Purpose: item?.purpose || 'NA',
            'Check In': this.formatTime(item?.check_in_time),
            'Check Out': this.formatTime(item?.check_out_time),
            Status: this.getStatusLabel(item?.visit_status),
          };
        }
      });

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rows);
      const colWidths = Object.keys(rows[0]).map((key) => {
        const maxLen = Math.max(key.length, ...rows.map((r) => String(r[key] ?? '').length));
        return { wch: Math.min(maxLen + 2, 40) };
      });
      worksheet['!cols'] = colWidths;
      const workbook: XLSX.WorkBook = XLSX.utils.book_new();
      const sheetName = this.isEmployeeView ? 'Employees' : 'Visitors';
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const ts = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
      const prefix = this.isEmployeeView ? 'Employees' : 'Visitor_Activity';
      const fileName = `${prefix}_${this.selectedType}_${ts}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      this.notification.success(`${rows.length} records exported successfully`);
    } catch (err) {
      console.error('Export Error:', err);
      this.notification.error('Excel export me error aaya');
    } finally {
      this.isExporting = false;
    }
  }
}
