import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '@core/services/contact.service';
import { ToastService } from '@core/services/toast.service';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';
import { RevealDirective } from '@shared/directives/reveal.directive';
import { shake } from '@shared/animations/shared.animations';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SectionHeadingComponent, RevealDirective],
  template: `
    <section id="contact" class="section contact-section">
      <div class="container">
        <app-section-heading tag="Get In Touch" title="Contact Me"></app-section-heading>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="contact-form glass-card" appReveal
              [@shake]="shakeState()">
          <div class="form-group">
            <div class="input-wrapper">
              <input type="text" formControlName="name" id="name" placeholder=" " />
              <label for="name">Your Name</label>
              <div class="input-line"></div>
            </div>
            <p class="error-msg" *ngIf="form.get('name')?.invalid && form.get('name')?.touched">
              Name is required
            </p>
          </div>

          <div class="form-group">
            <div class="input-wrapper">
              <input type="email" formControlName="email" id="email" placeholder=" " />
              <label for="email">Your Email</label>
              <div class="input-line"></div>
            </div>
            <p class="error-msg" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">
              Valid email is required
            </p>
          </div>

          <div class="form-group">
            <div class="input-wrapper">
              <input type="text" formControlName="subject" id="subject" placeholder=" " />
              <label for="subject">Subject</label>
              <div class="input-line"></div>
            </div>
            <p class="error-msg" *ngIf="form.get('subject')?.invalid && form.get('subject')?.touched">
              Subject is required
            </p>
          </div>

          <div class="form-group">
            <div class="input-wrapper">
              <textarea formControlName="message" id="message" rows="5" placeholder=" "></textarea>
              <label for="message">Message</label>
              <div class="input-line"></div>
            </div>
            <p class="error-msg" *ngIf="form.get('message')?.invalid && form.get('message')?.touched">
              Message is required (min 10 characters)
            </p>
          </div>

          <button type="submit" class="btn btn--primary btn--full" [disabled]="submitting()">
            <span *ngIf="!submitting()">Send Message</span>
            <span *ngIf="submitting()" class="spinner"></span>
          </button>
        </form>
      </div>
    </section>
  `,
  styleUrls: ['./contact.component.scss'],
  animations: [shake]
})
export class ContactComponent {
  readonly submitting = signal(false);
  readonly shakeState = signal<'idle' | 'shaking'>('idle');

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.triggerShake();
      return;
    }

    this.submitting.set(true);
    this.contactService.send(this.form.value).subscribe(success => {
      this.submitting.set(false);
      if (success) {
        this.toast.show('Message sent successfully!', 'success');
        this.form.reset();
      } else {
        this.toast.show('Failed to send message. Please try again.', 'error');
        this.triggerShake();
      }
    });
  }

  private triggerShake(): void {
    this.shakeState.set('shaking');
    setTimeout(() => this.shakeState.set('idle'), 500);
  }
}
