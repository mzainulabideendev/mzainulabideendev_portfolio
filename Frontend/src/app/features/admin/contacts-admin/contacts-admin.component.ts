import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContactService } from '@core/services/contact.service';
import { ToastService } from '@core/services/toast.service';
import { ContactMessage } from '@core/models';
import { RevealDirective } from '@shared/directives/reveal.directive';

@Component({
  selector: 'app-contacts-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, RevealDirective],
  template: `
    <section class="section admin-contacts">
      <div class="container">
        <div class="admin-contacts__header" appReveal>
          <h2>Admin Contacts</h2>
          <p>Review, mark, and remove contact messages.</p>
        </div>

        <div class="admin-contacts__actions" appReveal>
          <a routerLink="/admin/bio" class="btn btn--outline">Back to Bio</a>
          <a routerLink="/admin/books" class="btn btn--outline">Manage Books</a>
          <a routerLink="/admin/projects" class="btn btn--outline">Manage Projects</a>
          <a routerLink="/admin/pictures" class="btn btn--outline">Manage Pictures</a>
          <a routerLink="/" class="btn btn--outline">Back to Portfolio</a>
        </div>

        <div class="admin-contacts__list" appReveal>
          <div *ngIf="loading()" class="empty-state">Loading messages...</div>
          <div *ngIf="!loading() && messages().length === 0" class="empty-state">
            No contact messages yet.
          </div>

          <div *ngIf="!loading() && messages().length" class="messages-grid">
            <article *ngFor="let msg of messages(); trackBy: trackById"
                     class="message-card glass-card"
                     [class.unread]="!msg.isRead">
              <div class="message-card__header">
                <div>
                  <h3>{{ msg.subject }}</h3>
                  <p class="message-card__meta">{{ msg.name }} • {{ msg.email }}</p>
                </div>
                <span class="message-card__date">{{ formatDate(msg.createdAt) }}</span>
              </div>

              <p class="message-card__body">{{ msg.message }}</p>

              <div class="message-card__actions">
                <button class="btn btn--sm btn--outline" (click)="markRead(msg)"
                  [disabled]="msg.isRead || isMarking(msg) || saving()">
                  Mark Read
                </button>
                <button class="btn btn--sm btn--primary" (click)="deleteMessage(msg)" [disabled]="saving()">
                  Delete
                </button>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./contacts-admin.component.scss']
})
export class ContactsAdminComponent implements OnInit {
  readonly messages = signal<ContactMessage[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly markingIds = signal<Set<number>>(new Set());

  constructor(
    private contactService: ContactService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  markRead(message: ContactMessage): void {
    const id = message.id;
    if (id == null) return;
    this.addMarking(id);
    this.saving.set(true);
    this.contactService.markRead(id).subscribe(res => {
      this.saving.set(false);
      this.removeMarking(id);
      if (res) {
        this.toast.show('Marked as read.', 'success');
        this.refresh();
      } else {
        this.toast.show('Failed to mark as read.', 'error');
      }
    });
  }

  deleteMessage(message: ContactMessage): void {
    const id = message.id;
    if (id == null) return;
    this.saving.set(true);
    this.contactService.delete(id).subscribe(success => {
      this.saving.set(false);
      if (success) {
        this.toast.show('Message deleted.', 'success');
        this.refresh();
      } else {
        this.toast.show('Failed to delete message.', 'error');
      }
    });
  }

  private refresh(): void {
    this.loading.set(true);
    this.contactService.getAll().subscribe(data => {
      const sorted = [...data].sort((a, b) => {
        const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
        const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
        return bTime - aTime;
      });
      this.messages.set(sorted);
      this.loading.set(false);
    });
  }

  formatDate(value?: string): string {
    if (!value) return '—';
    const date = new Date(value);
    return date.toLocaleString();
  }

  trackById(_: number, item: ContactMessage): number | undefined {
    return item.id;
  }

  isMarking(message: ContactMessage): boolean {
    const id = message.id;
    if (id == null) return false;
    return this.markingIds().has(id);
  }

  private addMarking(id: number): void {
    const next = new Set(this.markingIds());
    next.add(id);
    this.markingIds.set(next);
  }

  private removeMarking(id: number): void {
    const next = new Set(this.markingIds());
    next.delete(id);
    this.markingIds.set(next);
  }
}
