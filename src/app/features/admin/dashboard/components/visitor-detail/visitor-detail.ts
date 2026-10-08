import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-visitor-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visitor-detail.html',
  styleUrl: './visitor-detail.scss',
})
export class VisitorDetail implements OnInit {
  @Input() visitor: any;

  private bsModalService = inject(BsModalService);

  constructor() { }
  ngOnInit(): void {}

  cancel(): void {
    this.bsModalService.hide();
  }

  hasImage(): boolean {
    return !!this.visitor?.image;
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
  }

  formatDateTime(dt: string): string {
    if (!dt) return 'NA';
    try {
      const d = new Date(dt);
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return 'NA';
    }
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

  getStatusBadge(): string {
    const status = this.visitor?.visit_status?.toUpperCase();
    switch (status) {
      case 'CHECKED_IN':
      case 'STILL_INSIDE':
        return 'badge-success';
      case 'CHECKED_OUT':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  }

  getStatusLabel(): string {
    const status = this.visitor?.visit_status?.toUpperCase();
    switch (status) {
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
}
